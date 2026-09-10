import React, { useState, useEffect } from 'react';
import { userAPI, chatAPI } from '../../services/api';
import { useChat } from '../../context/ChatContext';
import { Search, UserPlus } from 'lucide-react';

const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { chats, setChats, setSelectedChat, onlineUsers } = useChat();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await userAPI.getUsers();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    };
    loadUsers();
  }, []);

  const handleSearch = (text) => {
    setQuery(text);
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }
    const q = text.toLowerCase();
    const matched = users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q))
    );
    setSearchResults(matched);
  };

  const handleStartChat = async (userId) => {
    setLoading(true);
    try {
      const { data } = await chatAPI.accessChat(userId);
      if (data.success && data.chat) {
        if (!chats.find((c) => c._id === data.chat._id)) {
          setChats([data.chat, ...chats]);
        }
        setSelectedChat(data.chat);
        setQuery('');
        setSearchResults([]);
      }
    } catch (err) {
      alert('Error accessing chat: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', padding: '12px 16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          gap: '8px'
        }}
      >
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search contacts or start chat..."
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none',
            width: '100%'
          }}
        />
      </div>

      {searchResults.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '56px',
            left: '16px',
            right: '16px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            maxHeight: '220px',
            overflowY: 'auto',
            zIndex: 100,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}
        >
          {searchResults.map((u) => {
            const isOnline = onlineUsers.has(String(u._id));
            return (
              <div
                key={u._id}
                onClick={() => handleStartChat(u._id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-color)',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                  {u.username.charAt(0).toUpperCase()}
                  <span className={isOnline ? 'online-badge' : 'offline-badge'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {u.username}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
                <UserPlus size={16} color="var(--accent)" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
