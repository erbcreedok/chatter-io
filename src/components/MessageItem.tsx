import React from 'react';
import type { ParsedMessage } from '../types';
import './MessageItem.css';

interface MessageItemProps {
  message: ParsedMessage;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: Date) => {
    return timestamp.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMessageTypeIcon = () => {
    switch (message.type) {
      case 'audio': return '🎵';
      case 'video': return '🎥';
      case 'image': return '🖼️';
      case 'sticker': return '😀';
      case 'document': return '📄';
      case 'call': return '📞';
      case 'system': return '⚙️';
      default: return null;
    }
  };

  const renderMessageContent = () => {
    if (message.isOmitted) {
      return (
        <div className="omitted-content">
          {getMessageTypeIcon()} <em>{message.type} omitted</em>
        </div>
      );
    }

    if (message.type === 'call') {
      return (
        <div className="call-message">
          📞 {message.content}
          {message.callDuration && (
            <span className="call-duration"> - {message.callDuration}</span>
          )}
        </div>
      );
    }

    if (message.type === 'system') {
      return (
        <div className="system-message">
          ⚙️ {message.content}
        </div>
      );
    }

    return (
      <div className="text-content">
        {message.type !== 'text' && (
          <span className="message-type-icon">{getMessageTypeIcon()}</span>
        )}
        {message.content}
      </div>
    );
  };

  const messageClass = `message-item ${message.type} ${
    message.sender === 'Акнур' ? 'sent' : 'received'
  } ${message.type === 'system' ? 'system' : ''}`;

  return (
    <div className={messageClass}>
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">{message.sender}</span>
          <div className="message-timestamp">
            <span className="message-time">{formatTime(message.timestamp)}</span>
            <span className="message-date">{formatDate(message.timestamp)}</span>
          </div>
        </div>
        <div className="message-text">
          {renderMessageContent()}
        </div>
      </div>
    </div>
  );
};