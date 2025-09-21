import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import './MessageInput.css';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <textarea
          className="message-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows={1}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!message.trim()}
        >
          Send
        </button>
      </div>
    </form>
  );
};
