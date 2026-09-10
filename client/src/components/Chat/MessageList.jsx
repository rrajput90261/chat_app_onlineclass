import React, { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { FileText, CheckCheck } from 'lucide-react';

const MessageList = ({ messages }) => {
  const { user, selectedChat } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!messages.length) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        No messages here yet. Say hello 👋!
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {messages.map((msg) => {
        const senderId = String(msg.sender?._id || msg.sender?.id || msg.sender);
        const currentUserId = String(user?._id || user?.id);
        const isOutgoing = senderId === currentUserId;
        const senderName = msg.sender?.username || 'User';

        const d = new Date(msg.createdAt);
        const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <div
            key={msg._id || Math.random()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '68%',
              alignSelf: isOutgoing ? 'flex-end' : 'flex-start',
              alignItems: isOutgoing ? 'flex-end' : 'flex-start'
            }}
          >
            {!isOutgoing && selectedChat?.isGroupChat && (
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '3px' }}>
                {senderName}
              </span>
            )}

            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                lineHeight: '1.45',
                wordBreak: 'break-word',
                background: isOutgoing ? 'var(--bubble-outgoing)' : 'var(--bubble-incoming)',
                color: 'var(--text-primary)',
                border: isOutgoing ? 'none' : '1px solid var(--border-color)',
                borderBottomRightRadius: isOutgoing ? '2px' : 'var(--radius-md)',
                borderBottomLeftRadius: isOutgoing ? 'var(--radius-md)' : '2px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              {/* Attachment Preview */}
              {msg.fileUrl && (
                <div style={{ marginBottom: '8px' }}>
                  {msg.fileType === 'image' ? (
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                      <img
                        src={msg.fileUrl}
                        alt="attachment"
                        style={{
                          maxWidth: '240px',
                          maxHeight: '240px',
                          borderRadius: 'var(--radius-sm)',
                          display: 'block',
                          objectFit: 'cover'
                        }}
                      />
                    </a>
                  ) : (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(0,0,0,0.2)',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        color: 'inherit',
                        textDecoration: 'none',
                        fontSize: '13px'
                      }}
                    >
                      <FileText size={18} />
                      <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.fileName || 'Attachment'}
                      </span>
                    </a>
                  )}
                </div>
              )}

              {/* Message text */}
              {msg.content && <div>{msg.content}</div>}

              {/* Meta info (timestamp + checkmark) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  marginTop: '4px',
                  color: isOutgoing ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                  justifyContent: 'flex-end'
                }}
              >
                <span>{timeStr}</span>
                {isOutgoing && <CheckCheck size={13} color="rgba(255,255,255,0.85)" />}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
