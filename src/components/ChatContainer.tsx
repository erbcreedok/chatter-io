import React, { useState } from 'react';
import { MessageList } from './MessageList';
import { ChatSidebar } from './ChatSidebar';
import { ChatStats } from './ChatStats';
import type { ParsedChat } from '../types';
import { useChatData } from '../hooks/useChatData';
import './ChatContainer.css';

export const ChatContainer: React.FC = () => {
  const { 
    chats, 
    selectedChat, 
    setSelectedChat, 
    getSelectedChatMessages,
    loading,
    error,
    getChatStatistics
  } = useChatData();

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const messages = getSelectedChatMessages();

  const handleChatSelect = (chat: ParsedChat) => {
    setSelectedChat(chat);
    // Auto-hide sidebar on mobile after selecting a chat
    if (window.innerWidth <= 768) {
      setSidebarVisible(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  if (loading) {
    return (
      <div className="chat-container">
        <div className="loading-state">
          <p>Loading chats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-container">
        <div className="error-state">
          <p>Error loading chats: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Mobile sidebar overlay */}
      {sidebarVisible && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarVisible(false)}
        />
      )}
      
      <ChatSidebar 
        chats={chats}
        selectedChat={selectedChat}
        onChatSelect={handleChatSelect}
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
      
      <div className="chat-main">
        <div className="chat-header">
          <div className="chat-title-section">
            <div className="chat-title-row">
              <button 
                className="sidebar-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle chat list"
              >
                ☰
              </button>
              <h2>{selectedChat?.name || 'Select a chat to view'}</h2>
            </div>
            {selectedChat && (
              <div className="chat-info">
                <span className="message-count">{selectedChat.messageCount} messages</span>
                <span className="participants">
                  {selectedChat.participants.length} participants: {selectedChat.participants.join(', ')}
                </span>
                {selectedChat.hasMedia && (
                  <span className="media-indicator">📎 Has media files</span>
                )}
              </div>
            )}
          </div>
          
        </div>
        
        {selectedChat ? (
          <div className="chat-content">
            <MessageList messages={messages} />
          </div>
        ) : (
          <div className="no-chat-selected">
            <p>Select a chat from the sidebar to view messages</p>
            <ChatStats statistics={getChatStatistics()} />
          </div>
        )}
      </div>
    </div>
  );
};