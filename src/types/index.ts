export interface ParsedMessage {
  id: string;
  timestamp: Date;
  sender: string;
  content: string;
  type: 'text' | 'audio' | 'video' | 'sticker' | 'image' | 'document' | 'call' | 'system';
  isOmitted?: boolean; // for "audio omitted", "sticker omitted" etc.
  callDuration?: string; // for call messages like "Video call 13 min"
  mediaFile?: MediaFile; // Associated media file if available
}

export interface MediaFile {
  name: string;
  path: string;
  publicUrl: string;
  size: number;
  type: string;
}

export interface MediaCollection {
  images: MediaFile[];
  videos: MediaFile[];
  audio: MediaFile[];
  documents: MediaFile[];
}

export interface ParsedChat {
  id: string;
  name: string;
  participants: string[];
  messages: ParsedMessage[];
  messageCount: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  hasMedia: boolean;
  mediaFiles?: MediaCollection;
}

export interface ChatCollection {
  chats: ParsedChat[];
  totalChats: number;
  totalMessages: number;
}

// Legacy interfaces for compatibility
export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  type: 'sent' | 'received';
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}