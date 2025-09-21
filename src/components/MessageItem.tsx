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
    // Render media content if available
    if (message.mediaFile) {
      return renderMediaContent();
    }

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

  const renderMediaContent = () => {
    if (!message.mediaFile) return null;

    const { mediaFile } = message;
    const cleanContent = message.content.replace(/<attached:\s*[^>]+>/gi, '').trim();

    return (
      <div className="media-message">
        {/* Render the actual media */}
        {['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(mediaFile.type) && (
          <div className="image-attachment">
            <img 
              src={mediaFile.publicUrl} 
              alt={mediaFile.name}
              className="message-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling!.textContent = `🖼️ Image: ${mediaFile.name}`;
              }}
            />
            <div className="fallback-text" style={{ display: 'none' }}></div>
          </div>
        )}
        
        {['mp4', 'mov', 'avi', 'webm'].includes(mediaFile.type) && (
          <div className="video-attachment">
            <video 
              controls 
              className="message-video"
              preload="metadata"
            >
              <source src={mediaFile.publicUrl} type={`video/${mediaFile.type}`} />
              🎥 Video: {mediaFile.name}
            </video>
          </div>
        )}
        
        {['opus', 'mp3', 'wav', 'm4a', 'ogg'].includes(mediaFile.type) && (
          <div className="audio-attachment">
            <div className="audio-header">
              🎵 {mediaFile.type === 'opus' ? 'Voice Message' : 'Audio'}
            </div>
            <audio 
              controls 
              className="message-audio"
              preload="metadata"
            >
              <source src={mediaFile.publicUrl} type={`audio/${mediaFile.type === 'opus' ? 'ogg' : mediaFile.type}`} />
              Audio file: {mediaFile.name}
            </audio>
          </div>
        )}
        
        {mediaFile.type === 'vcf' && (
          <div className="contact-attachment">
            📇 Contact: {mediaFile.name}
            <a href={mediaFile.publicUrl} download className="download-link">
              Download Contact
            </a>
          </div>
        )}
        
        {/* Show any remaining text content */}
        {cleanContent && (
          <div className="message-text-with-media">
            {cleanContent}
          </div>
        )}
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