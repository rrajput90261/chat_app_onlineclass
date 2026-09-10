import React from 'react';
import { useChat } from '../../context/ChatContext';

const ChatList = () => {
  const { chats, selectedChat, setSelectedChat, user, onlineUsers } = useChat();

  const getChatDetails = (chat) => {
    if (chat.isGroupChat) {
      return {
        name: chat.chatName || 'Group Chat',
        isOnline: false,
        initial: (chat.chatName || 'G').charAt(0).toUpperCase()
      };
    }
    const otherUser = chat.users?.find(
      (u) => String(u._id || u.id) !== String(user?._id || user?.id)
    );
    const isOnline = otherUser ? onlineUsers.has(String(otherUser._id || otherUser.id)) : false;
    return {
      name: otherUser?.username || 'Unknown User',
      isOnline,
      initial: (otherUser?.username || 'U').charAt(0).toUpperCase()
    };
  };

  if (!chats.length) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 20px', fontSize: '13px' }}>
        No conversations yet.<br />Search for a classmate above to start messaging!
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
      {chats.map((chat) => {
        const { name, isOnline, initial } = getChatDetails(chat);
        const isSelected = selectedChat?._id === chat._id;
        
        let snippet = 'No messages yet';
        let time = '';
        if (chat.latestMessage) {
          snippet = chat.latestMessage.content || (chat.latestMessage.fileUrl ? '📎 Attachment' : '');
          const d = new Date(chat.latestMessage.createdAt);
          time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        return (
          <div
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              marginBottom: '4px',
              background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.background = 'var(--bg-tertiary)';
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.background = 'transparent';
            }}
          >
            <div className="avatar">
              {initial}
              {!chat.isGroupChat && (
                <span className={isOnline ? 'online-badge' : 'offline-badge'} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {name}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {time}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {snippet}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
