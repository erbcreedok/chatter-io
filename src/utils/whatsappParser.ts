import type { ParsedMessage, ParsedChat, MediaCollection, MediaFile } from '../types';

export class WhatsAppParser {
  // Regex pattern to match WhatsApp message format: [DD.MM.YYYY, HH:MM:SS] Sender: Message
  private static readonly MESSAGE_PATTERN = /^\[(\d{2}\.\d{2}\.\d{4}), (\d{2}:\d{2}:\d{2})\] (.+?): (.*)$/;
  
  // Regex pattern for system messages (security code changes, etc.)
  private static readonly SYSTEM_PATTERN = /^\[(\d{2}\.\d{2}\.\d{4}), (\d{2}:\d{2}:\d{2})\] (.+)$/;

  static parseChat(chatContent: string, chatName: string, mediaFiles: MediaCollection | string[] = []): ParsedChat {
    const lines = chatContent.split('\n').filter(line => line.trim());
    const messages: ParsedMessage[] = [];
    const participants = new Set<string>();
    
    // Create a flat array of all media files for easier lookup
    const allMediaFiles: MediaFile[] = [];
    if (!Array.isArray(mediaFiles)) {
      allMediaFiles.push(
        ...mediaFiles.images,
        ...mediaFiles.videos,
        ...mediaFiles.audio,
        ...mediaFiles.documents
      );
    }
    
    let currentMessage: ParsedMessage | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) continue;
      
      // Try to match regular message pattern
      const messageMatch = line.match(this.MESSAGE_PATTERN);
      
      if (messageMatch) {
        // Save previous message if exists
        if (currentMessage) {
          messages.push(currentMessage);
        }
        
        const [, date, time, sender, content] = messageMatch;
        const timestamp = this.parseTimestamp(date, time);
        
        // Clean sender name (remove phone number formatting)
        const cleanSender = this.cleanSenderName(sender);
        participants.add(cleanSender);
        
        const messageType = this.determineMessageType(content);
        const associatedMedia = this.findAssociatedMedia(content, allMediaFiles);
        
        currentMessage = {
          id: `${timestamp.getTime()}-${messages.length}`,
          timestamp,
          sender: cleanSender,
          content: content.trim(),
          type: messageType,
          isOmitted: this.isOmittedContent(content),
          callDuration: this.extractCallDuration(content),
          mediaFile: associatedMedia
        };
      } else {
        // Check if it's a system message
        const systemMatch = line.match(this.SYSTEM_PATTERN);
        
        if (systemMatch) {
          // Save previous message if exists
          if (currentMessage) {
            messages.push(currentMessage);
          }
          
          const [, date, time, content] = systemMatch;
          const timestamp = this.parseTimestamp(date, time);
          
          currentMessage = {
            id: `${timestamp.getTime()}-${messages.length}`,
            timestamp,
            sender: 'System',
            content: content.trim(),
            type: 'system'
          };
        } else if (currentMessage) {
          // This is a continuation of the previous message (multiline)
          currentMessage.content += '\n' + line;
        }
      }
    }
    
    // Add the last message
    if (currentMessage) {
      messages.push(currentMessage);
    }
    
    // Sort messages by timestamp
    messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    const dateRange = {
      start: messages.length > 0 ? messages[0].timestamp : new Date(),
      end: messages.length > 0 ? messages[messages.length - 1].timestamp : new Date()
    };
    
    // Handle both old string array format and new MediaCollection format
    const hasMedia = Array.isArray(mediaFiles) 
      ? mediaFiles.length > 0 
      : Object.values(mediaFiles).some(arr => arr.length > 0);
    
    const processedMediaFiles = Array.isArray(mediaFiles) 
      ? { images: [], videos: [], audio: [], documents: [] } // Convert old format to new
      : mediaFiles;
    
    return {
      id: this.generateChatId(chatName),
      name: chatName,
      participants: Array.from(participants),
      messages,
      messageCount: messages.length,
      dateRange,
      hasMedia,
      mediaFiles: processedMediaFiles
    };
  }
  
  private static parseTimestamp(date: string, time: string): Date {
    // Convert DD.MM.YYYY to YYYY-MM-DD
    const [day, month, year] = date.split('.');
    const dateString = `${year}-${month}-${day}T${time}`;
    return new Date(dateString);
  }
  
  private static cleanSenderName(sender: string): string {
    // Remove phone number formatting like ‪+7 705 444 1059‬
    return sender
      .replace(/‪/g, '') // Remove left-to-right embedding
      .replace(/‬/g, '') // Remove pop directional formatting
      .replace(/^\+\d+\s+\d+\s+\d+\s+\d+$/, 'Unknown Contact') // Replace phone numbers
      .trim();
  }
  
  private static determineMessageType(content: string): ParsedMessage['type'] {
    if (content.includes('audio omitted') || content.includes('‎audio omitted')) {
      return 'audio';
    }
    if (content.includes('sticker omitted') || content.includes('‎sticker omitted')) {
      return 'sticker';
    }
    if (content.includes('image omitted') || content.includes('‎image omitted')) {
      return 'image';
    }
    if (content.includes('video omitted') || content.includes('‎video omitted')) {
      return 'video';
    }
    if (content.includes('document omitted') || content.includes('‎document omitted')) {
      return 'document';
    }
    if (content.includes('Video call') || content.includes('Voice call') || content.includes('Call')) {
      return 'call';
    }
    
    return 'text';
  }
  
  private static isOmittedContent(content: string): boolean {
    return content.includes('omitted') || content.includes('‎');
  }
  
  private static extractCallDuration(content: string): string | undefined {
    const callMatch = content.match(/(Video call|Voice call|Call)\s*‎?\s*(.+?)(?:\s|$)/);
    if (callMatch && callMatch[2]) {
      return callMatch[2].trim();
    }
    return undefined;
  }
  
  private static findAssociatedMedia(content: string, mediaFiles: MediaFile[]): MediaFile | undefined {
    // Look for media file references in the message content
    // Pattern: <attached: filename> or similar
    const attachmentMatch = content.match(/<attached:\s*([^>]+)>/i);
    if (attachmentMatch) {
      const fileName = attachmentMatch[1].trim();
      return mediaFiles.find(file => file.name === fileName);
    }
    
    // Look for direct file references
    const fileMatch = content.match(/(-\d{7}-[A-Z]+-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}\.[a-z]+)/i);
    if (fileMatch) {
      const fileName = fileMatch[1];
      return mediaFiles.find(file => file.name === fileName);
    }
    
    return undefined;
  }

  private static generateChatId(chatName: string): string {
    return chatName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
