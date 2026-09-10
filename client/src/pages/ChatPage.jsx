import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatBox from '../components/Chat/ChatBox';

const ChatPage = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar />
      <ChatBox />
    </div>
  );
};

export default ChatPage;
