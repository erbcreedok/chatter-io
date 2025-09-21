import { useState, useEffect } from 'react';
import type { ParsedChat, ChatCollection, ParsedMessage } from '../types';
import { ChatFileReader } from '../utils/chatFileReader';

export const useChatData = () => {
  const [chatCollection, setChatCollection] = useState<ChatCollection>({
    chats: [],
    totalChats: 0,
    totalMessages: 0
  });
  const [selectedChat, setSelectedChat] = useState<ParsedChat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all chats on component mount
  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true);
        const collection = await ChatFileReader.loadAllChats();
        setChatCollection(collection);
        
        // Auto-select first chat if available
        if (collection.chats.length > 0) {
          setSelectedChat(collection.chats[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chats');
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  // Get messages for selected chat
  const getSelectedChatMessages = (): ParsedMessage[] => {
    return selectedChat?.messages || [];
  };

  // Get chat statistics
  const getChatStatistics = () => {
    return ChatFileReader.getChatStatistics(chatCollection.chats);
  };

  // Search messages across all chats
  const searchMessages = (query: string): ParsedMessage[] => {
    if (!query.trim()) return [];
    
    const results: ParsedMessage[] = [];
    const searchTerm = query.toLowerCase();
    
    chatCollection.chats.forEach(chat => {
      chat.messages.forEach(message => {
        if (
          message.content.toLowerCase().includes(searchTerm) ||
          message.sender.toLowerCase().includes(searchTerm)
        ) {
          results.push(message);
        }
      });
    });
    
    return results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  // Filter chats by participant
  const getChatsByParticipant = (participantName: string): ParsedChat[] => {
    return chatCollection.chats.filter(chat =>
      chat.participants.some(p => 
        p.toLowerCase().includes(participantName.toLowerCase())
      )
    );
  };

  // Get chats with media
  const getChatsWithMedia = (): ParsedChat[] => {
    return chatCollection.chats.filter(chat => chat.hasMedia);
  };

  // Get recent chats (sorted by last message date)
  const getRecentChats = (limit?: number): ParsedChat[] => {
    const sorted = [...chatCollection.chats].sort((a, b) => 
      b.dateRange.end.getTime() - a.dateRange.end.getTime()
    );
    
    return limit ? sorted.slice(0, limit) : sorted;
  };

  return {
    // Data
    chats: chatCollection.chats,
    selectedChat,
    totalChats: chatCollection.totalChats,
    totalMessages: chatCollection.totalMessages,
    
    // State
    loading,
    error,
    
    // Actions
    setSelectedChat,
    getSelectedChatMessages,
    getChatStatistics,
    searchMessages,
    getChatsByParticipant,
    getChatsWithMedia,
    getRecentChats,
    
    // Legacy compatibility (for existing components)
    messages: getSelectedChatMessages(),
    chatRooms: chatCollection.chats.map(chat => ({
      id: chat.id,
      name: chat.name,
      participants: [],
      lastMessage: chat.messages.length > 0 ? {
        id: chat.messages[chat.messages.length - 1].id,
        text: chat.messages[chat.messages.length - 1].content,
        sender: chat.messages[chat.messages.length - 1].sender,
        timestamp: chat.messages[chat.messages.length - 1].timestamp,
        type: 'received' as const
      } : undefined,
      unreadCount: 0
    })),
    addMessage: () => {}, // Disabled for read-only viewer
    addChatRoom: () => {} // Disabled for read-only viewer
  };
};