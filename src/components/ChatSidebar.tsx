import React, { useState } from 'react';
import type { ParsedChat } from '../types';
import './ChatSidebar.css';

interface ChatSidebarProps {
  chats: ParsedChat[];
  selectedChat: ParsedChat | null;
  onChatSelect: (chat: ParsedChat) => void;
  isVisible?: boolean;
  onClose?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  chats, 
  selectedChat, 
  onChatSelect,
  isVisible = true,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'messages'>('date');

  const filteredAndSortedChats = chats
    .filter(chat => 
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return b.dateRange.end.getTime() - a.dateRange.end.getTime();
        case 'messages':
          return b.messageCount - a.messageCount;
        default:
          return 0;
      }
    });

  const formatLastMessageDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getLastMessage = (chat: ParsedChat) => {
    if (chat.messages.length === 0) return null;
    const lastMessage = chat.messages[chat.messages.length - 1];
    
    let preview = lastMessage.content;
    if (lastMessage.type !== 'text') {
      const typeEmojis = {
        audio: '🎵',
        video: '🎥',
        image: '🖼️',
        sticker: '😀',
        document: '📄',
        call: '📞',
        system: '⚙️'
      };
      preview = `${typeEmojis[lastMessage.type] || '📝'} ${lastMessage.type}`;
    }
    
    return {
      preview: preview.length > 50 ? preview.substring(0, 50) + '...' : preview,
      date: lastMessage.timestamp
    };
  };

  return (
    <aside className={`chat-sidebar ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-top">
          <h3>WhatsApp Chats ({chats.length})</h3>
          {onClose && (
            <button 
              className="sidebar-close"
              onClick={onClose}
              aria-label="Close chat list"
            >
              ×
            </button>
          )}
        </div>
        <div className="sidebar-controls">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'messages')}
            className="sort-select"
          >
            <option value="date">Latest</option>
            <option value="name">Name</option>
            <option value="messages">Messages</option>
          </select>
        </div>
      </div>
      
      <div className="chat-list">
        {filteredAndSortedChats.length === 0 ? (
          <div className="no-chats">
            {searchTerm ? 'No chats match your search' : 'No chats available'}
          </div>
        ) : (
          filteredAndSortedChats.map((chat) => {
            const lastMessage = getLastMessage(chat);
            
            return (
              <div
                key={chat.id}
                className={`chat-item ${selectedChat?.id === chat.id ? 'selected' : ''}`}
                onClick={() => onChatSelect(chat)}
              >
                <div className="chat-info">
                  <div className="chat-header-row">
                    <h4 className="chat-name">{chat.name}</h4>
                    {lastMessage && (
                      <span className="last-date">
                        {formatLastMessageDate(lastMessage.date)}
                      </span>
                    )}
                  </div>
                  
                  <div className="chat-details">
                    <div className="participants">
                      👥 {chat.participants.join(', ')}
                    </div>
                    {lastMessage && (
                      <p className="last-message">{lastMessage.preview}</p>
                    )}
                  </div>
                  
                  <div className="chat-meta">
                    <span className="message-count">
                      💬 {chat.messageCount}
                    </span>
                    {chat.hasMedia && chat.mediaFiles && (
                      <span className="media-badge" title="Media files">
                        📎 {Object.values(chat.mediaFiles).reduce((total, files) => total + files.length, 0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};