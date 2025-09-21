import React from 'react';
import type { ParsedMessage } from '../types';
import { MessageItem } from './MessageItem';
import './MessageList.css';

interface MessageListProps {
  messages: ParsedMessage[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-state">
          <p>No messages in this chat.</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))
      )}
    </div>
  );
};