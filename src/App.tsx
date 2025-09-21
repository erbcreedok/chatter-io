import React from 'react';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { Footer } from './components/Footer';
import './App.css';

function App(): React.ReactElement {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <ChatContainer />
      </main>
      <Footer />
    </div>
  );
}

export default App;