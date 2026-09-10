import React from 'react';
import { useChat } from './context/ChatContext';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';

function App() {
  const { user, loading } = useChat();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'var(--bg-primary)',
          color: 'var(--text-secondary)'
        }}
      >
        Connecting...
      </div>
    );
  }

  return user ? <ChatPage /> : <AuthPage />;
}

export default App;
