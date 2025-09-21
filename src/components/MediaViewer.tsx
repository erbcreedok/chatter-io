import React, { useState } from 'react';
import type { MediaCollection, MediaFile } from '../types';
import './MediaViewer.css';

interface MediaViewerProps {
  mediaFiles: MediaCollection;
  chatName: string;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ mediaFiles }) => {
  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'audio' | 'documents'>('images');
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);

  const getTotalCount = () => {
    return Object.values(mediaFiles).reduce((total, files) => total + files.length, 0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMediaGrid = (files: MediaFile[], type: string) => {
    if (files.length === 0) {
      return <div className="no-media">No {type} files in this chat</div>;
    }

    return (
      <div className="media-grid">
        {files.map((file, index) => (
          <div
            key={index}
            className="media-item"
            onClick={() => setSelectedMedia(file)}
          >
            <div className="media-preview">
              {type === 'images' && (
                <div className="image-placeholder">
                  🖼️
                  <span className="file-type">{file.type.toUpperCase()}</span>
                </div>
              )}
              {type === 'videos' && (
                <div className="video-placeholder">
                  🎥
                  <span className="file-type">{file.type.toUpperCase()}</span>
                </div>
              )}
              {type === 'audio' && (
                <div className="audio-placeholder">
                  🎵
                  <span className="file-type">{file.type.toUpperCase()}</span>
                </div>
              )}
              {type === 'documents' && (
                <div className="document-placeholder">
                  📄
                  <span className="file-type">{file.type.toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="media-info">
              <div className="file-name" title={file.name}>
                {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
              </div>
              <div className="file-size">{formatFileSize(file.size)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMediaModal = () => {
    if (!selectedMedia) return null;

    return (
      <div className="media-modal" onClick={() => setSelectedMedia(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{selectedMedia.name}</h3>
            <button 
              className="close-button"
              onClick={() => setSelectedMedia(null)}
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            {selectedMedia.type === 'opus' && (
              <div className="audio-player">
                <audio controls>
                  <source src={`file://${selectedMedia.path}`} type="audio/ogg" />
                  <p>Your browser doesn't support audio playback.</p>
                </audio>
                <p className="audio-note">
                  📱 This is a WhatsApp voice message (.opus format)
                </p>
              </div>
            )}
            {['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(selectedMedia.type) && (
              <div className="image-viewer">
                <img 
                  src={`file://${selectedMedia.path}`} 
                  alt={selectedMedia.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.textContent = 'Image could not be loaded';
                  }}
                />
                <p className="fallback-text" style={{ display: 'none' }}></p>
              </div>
            )}
            {['mp4', 'mov', 'avi', 'webm'].includes(selectedMedia.type) && (
              <div className="video-player">
                <video controls>
                  <source src={`file://${selectedMedia.path}`} type={`video/${selectedMedia.type}`} />
                  <p>Your browser doesn't support video playback.</p>
                </video>
              </div>
            )}
            {selectedMedia.type === 'vcf' && (
              <div className="contact-info">
                📇 Contact file (.vcf)
                <p>This file contains contact information that was shared in the chat.</p>
              </div>
            )}
            <div className="file-details">
              <p><strong>File:</strong> {selectedMedia.name}</p>
              <p><strong>Size:</strong> {formatFileSize(selectedMedia.size)}</p>
              <p><strong>Type:</strong> {selectedMedia.type.toUpperCase()}</p>
              <p><strong>Path:</strong> {selectedMedia.path}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (getTotalCount() === 0) {
    return (
      <div className="media-viewer empty">
        <p>No media files in this chat</p>
      </div>
    );
  }

  return (
    <div className="media-viewer">
      <div className="media-header">
        <h3>Media Files ({getTotalCount()})</h3>
      </div>
      
      <div className="media-tabs">
        <button
          className={`tab ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          🖼️ Images ({mediaFiles.images.length})
        </button>
        <button
          className={`tab ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          🎥 Videos ({mediaFiles.videos.length})
        </button>
        <button
          className={`tab ${activeTab === 'audio' ? 'active' : ''}`}
          onClick={() => setActiveTab('audio')}
        >
          🎵 Audio ({mediaFiles.audio.length})
        </button>
        <button
          className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          📄 Docs ({mediaFiles.documents.length})
        </button>
      </div>

      <div className="media-content">
        {renderMediaGrid(mediaFiles[activeTab], activeTab)}
      </div>

      {renderMediaModal()}
    </div>
  );
};
