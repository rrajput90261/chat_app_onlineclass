import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { messageAPI } from '../../services/api';
import { getSocket } from '../../services/socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { MessageSquare, ArrowLeft } from 'lucide-react';

const ChatBox = () => {
  const { selectedChat, setSelectedChat, user, onlineUsers, setChats, chats } = useChat();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingInfo, setTypingInfo] = useState(null);

  const socket = getSocket();

  // Load chat messages when selectedChat changes
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data } = await messageAPI.getMessages(selectedChat._id);
        if (data.success) {
          setMessages(data.messages);
          // Mark as read
          messageAPI.markAsRead(selectedChat._id);
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Join room
    if (socket) {
      socket.emit('join_chat', selectedChat._id);
    }

    return () => {
      if (socket) {
        socket.emit('leave_chat', selectedChat._id);
      }
    };
  }, [selectedChat, socket]);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMsg) => {
      const chatId = newMsg.chat?._id || newMsg.chat;
      if (selectedChat && selectedChat._id === chatId) {
        setMessages((prev) => [...prev, newMsg]);
        messageAPI.markAsRead(chatId);
      }

      // Update snippet in chats list
      setChats((prev) => {
        const target = prev.find((c) => c._id === chatId);
        if (!target) return prev;
        const updated = { ...target, latestMessage: newMsg };
        return [updated, ...prev.filter((c) => c._id !== chatId)];
      });
    };

    const handleTyping = ({ room, username, userId }) => {
      if (selectedChat && selectedChat._id === room && String(userId) !== String(user?._id || user?.id)) {
        setTypingInfo(`${username || 'Someone'} is typing...`);
      }
    };

    const handleStopTyping = ({ room }) => {
      if (selectedChat && selectedChat._id === room) {
        setTypingInfo(null);
      }
    };

    socket.on('message_received', handleMessageReceived);
    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);

    return () => {
      socket.off('message_received', handleMessageReceived);
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
    };
  }, [socket, selectedChat, user, setChats]);

  // Header Details
  const getHeaderDetails = () => {
    if (!selectedChat) return { name: '', status: '', initial: 'C' };
    if (selectedChat.isGroupChat) {
      return {
        name: selectedChat.chatName || 'Group Chat',
        status: `${selectedChat.users?.length || 0} members`,
        initial: (selectedChat.chatName || 'G').charAt(0).toUpperCase()
      };
    }
    const otherUser = selectedChat.users?.find(
      (u) => String(u._id || u.id) !== String(user?._id || user?.id)
    );
    const isOnline = otherUser ? onlineUsers.has(String(otherUser._id || otherUser.id)) : false;
    return {
      name: otherUser?.username || 'Chat',
      status: isOnline ? 'Online' : 'Offline',
      isOnline,
      initial: (otherUser?.username || 'U').charAt(0).toUpperCase()
    };
  };

  const handleMessageSent = (savedMsg) => {
    setMessages((prev) => [...prev, savedMsg]);
    setChats((prev) => {
      const target = prev.find((c) => c._id === selectedChat._id);
      if (!target) return prev;
      const updated = { ...target, latestMessage: savedMsg };
      return [updated, ...prev.filter((c) => c._id !== selectedChat._id)];
    });
  };

  if (!selectedChat) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          background: 'var(--bg-primary)'
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: 'var(--accent)'
          }}
        >
          <MessageSquare size={38} />
        </div>
        <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Your Messages</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '340px', lineHeight: '1.5' }}>
          Select a conversation from the sidebar or search a classmate to begin chatting.
        </p>
      </div>
    );
  }

  const { name, status, isOnline, initial } = getHeaderDetails();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      {/* Chat Top Bar */}
      <div
        style={{
          padding: '14px 20px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <button
          className="btn-icon"
          onClick={() => setSelectedChat(null)}
          style={{ display: 'none' }} // Visible on mobile via CSS if needed
        >
          <ArrowLeft size={20} />
        </button>

        <div className="avatar">
          {initial}
          {!selectedChat.isGroupChat && (
            <span className={isOnline ? 'online-badge' : 'offline-badge'} />
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{name}</h3>
          <p
            style={{
              fontSize: '12px',
              color: isOnline ? 'var(--success)' : 'var(--text-secondary)'
            }}
          >
            {status}
          </p>
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          Loading conversation...
        </div>
      ) : (
        <MessageList messages={messages} />
      )}

      {/* Typing Indicator */}
      {typingInfo && (
        <div
          style={{
            padding: '6px 20px',
            fontSize: '12px',
            color: 'var(--accent)',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
          {typingInfo}
        </div>
      )}

      {/* Input Form */}
      <MessageInput onMessageSent={handleMessageSent} />
    </div>
  );
};

export default ChatBox;
