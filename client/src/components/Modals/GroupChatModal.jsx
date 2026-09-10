import React, { useState, useEffect } from 'react';
import { userAPI, chatAPI } from '../../services/api';
import { useChat } from '../../context/ChatContext';
import { X } from 'lucide-react';

const GroupChatModal = ({ isOpen, onClose }) => {
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { chats, setChats, setSelectedChat } = useChat();

  useEffect(() => {
    if (isOpen) {
      userAPI.getUsers().then(({ data }) => {
        if (data.success) {
          setAvailableUsers(data.users);
        }
      }).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleUser = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== userToAdd._id));
    } else {
      setSelectedUsers([...selectedUsers, userToAdd]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupChatName.trim() || selectedUsers.length < 2) {
      alert('Please provide a group name and select at least 2 users');
      return;
    }

    setLoading(true);
    try {
      const userIds = selectedUsers.map((u) => u._id);
      const { data } = await chatAPI.createGroup(groupChatName.trim(), userIds);
      if (data.success && data.chat) {
        setChats([data.chat, ...chats]);
        setSelectedChat(data.chat);
        setGroupChatName('');
        setSelectedUsers([]);
        onClose();
      }
    } catch (err) {
      alert('Failed to create group: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Create Group Chat</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Group Name
            </label>
            <input
              type="text"
              placeholder="e.g. Physics Class Group"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Select Members ({selectedUsers.length} selected - Min 2 required)
            </label>
            <div
              style={{
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '8px',
                background: 'var(--bg-primary)'
              }}
            >
              {availableUsers.map((u) => {
                const isSelected = selectedUsers.some((sel) => sel._id === u._id);
                return (
                  <label
                    key={u._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      marginBottom: '4px'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleUser(u)}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{u.username}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChatModal;
