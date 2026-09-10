import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import UserSearch from './UserSearch';
import ChatList from './ChatList';
import GroupChatModal from '../Modals/GroupChatModal';
import { LogOut, Users } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useChat();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  return (
    <aside
      style={{
        width: '360px',
        minWidth: '320px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="avatar">
            {(user?.username || 'U').charAt(0).toUpperCase()}
            <span className="online-badge" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '600' }}>{user?.username}</h3>
            <p style={{ fontSize: '11px', color: 'var(--success)' }}>● Active</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn-icon"
            title="Create Group"
            onClick={() => setIsGroupModalOpen(true)}
          >
            <Users size={18} />
          </button>
          <button className="btn-icon" title="Logout" onClick={logout}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* User Search & Discovery */}
      <UserSearch />

      {/* Conversation List */}
      <ChatList />

      {/* Group Modal */}
      <GroupChatModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;
