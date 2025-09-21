import React from 'react';
import './ChatStats.css';

interface ChatStatistics {
  totalMessages: number;
  totalParticipants: number;
  dateRange: { start: Date; end: Date } | null;
  messageTypes: Record<string, number>;
}

interface ChatStatsProps {
  statistics: ChatStatistics;
}

export const ChatStats: React.FC<ChatStatsProps> = ({ statistics }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return '💬';
      case 'audio': return '🎵';
      case 'video': return '🎥';
      case 'image': return '🖼️';
      case 'sticker': return '😀';
      case 'document': return '📄';
      case 'call': return '📞';
      case 'system': return '⚙️';
      default: return '📝';
    }
  };

  return (
    <div className="chat-stats">
      <h3>Chat Collection Overview</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-number">{statistics.totalMessages.toLocaleString()}</div>
            <div className="stat-label">Total Messages</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{statistics.totalParticipants}</div>
            <div className="stat-label">Unique Participants</div>
          </div>
        </div>
        
        {statistics.dateRange && (
          <div className="stat-card date-range">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-label">Date Range</div>
              <div className="date-info">
                <div>{formatDate(statistics.dateRange.start)}</div>
                <div className="date-separator">to</div>
                <div>{formatDate(statistics.dateRange.end)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {Object.keys(statistics.messageTypes).length > 0 && (
        <div className="message-types">
          <h4>Message Types</h4>
          <div className="type-list">
            {Object.entries(statistics.messageTypes)
              .sort(([,a], [,b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="type-item">
                  <span className="type-icon">{getMessageTypeIcon(type)}</span>
                  <span className="type-name">{type}</span>
                  <span className="type-count">{count.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
