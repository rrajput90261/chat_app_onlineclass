import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, chatAPI } from '../services/api';
import { initSocket, disconnectSocket } from '../services/socket';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Check auth session on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('chat_app_token');
      if (token) {
        try {
          const { data } = await authAPI.getProfile();
          if (data.success && data.user) {
            setUser(data.user);
          }
        } catch (err) {
          console.error('Session expired:', err);
          localStorage.removeItem('chat_app_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Initialize socket when user logs in
  useEffect(() => {
    if (!user) {
      disconnectSocket();
      setOnlineUsers(new Set());
      return;
    }

    const socket = initSocket(user);

    socket.on('all_online_users', (users) => {
      setOnlineUsers(new Set(users.map(String)));
    });

    socket.on('user_status', ({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (isOnline) {
          next.add(String(userId));
        } else {
          next.delete(String(userId));
        }
        return next;
      });
    });

    return () => {
      // Don't disconnect on re-render, only on logout
    };
  }, [user]);

  // Fetch chats function
  const fetchChats = async () => {
    if (!user) return;
    try {
      const { data } = await chatAPI.fetchChats();
      if (data.success) {
        setChats(data.chats);
      }
    } catch (err) {
      console.error('Failed to fetch chats:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  // Logout handler
  const logout = () => {
    localStorage.removeItem('chat_app_token');
    disconnectSocket();
    setUser(null);
    setSelectedChat(null);
    setChats([]);
    setOnlineUsers(new Set());
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        onlineUsers,
        fetchChats,
        logout,
        loading
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
