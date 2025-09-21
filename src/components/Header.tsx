import React from 'react';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">Chatter Viewer</h1>
        <div className="app-subtitle">WhatsApp Chat Archive Reader</div>
        <nav className="header-nav">
          <button className="nav-button">Export</button>
          <button className="nav-button">Search</button>
        </nav>
      </div>
    </header>
  );
};