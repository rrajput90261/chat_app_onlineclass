import React, { useState, useRef } from 'react';
import { messageAPI } from '../../services/api';
import { getSocket } from '../../services/socket';
import { useChat } from '../../context/ChatContext';
import { Send, Paperclip, X } from 'lucide-react';

const MessageInput = ({ onMessageSent }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const { selectedChat, user } = useChat();
  const socket = getSocket();

  const handleTyping = (e) => {
    setContent(e.target.value);
    if (!socket || !selectedChat) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('typing', {
        room: selectedChat._id,
        userId: user._id || user.id,
        username: user.username
      });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit('stop_typing', {
        room: selectedChat._id,
        userId: user._id || user.id
      });
    }, 2000);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!content.trim() && !file) || sending || !selectedChat) return;

    const messageText = content.trim();
    const messageFile = file;

    // Clear input right away
    setContent('');
    clearFile();

    if (socket && selectedChat) {
      socket.emit('stop_typing', {
        room: selectedChat._id,
        userId: user._id || user.id
      });
      isTypingRef.current = false;
      clearTimeout(typingTimeoutRef.current);
    }

    setSending(true);
    try {
      const { data } = await messageAPI.sendMessage(selectedChat._id, messageText, messageFile);
      if (data.success && data.message) {
        onMessageSent(data.message);
        if (socket) {
          socket.emit('new_message', data.message);
        }
      }
    } catch (err) {
      alert('Failed to send message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: '12px 20px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      {/* File Preview Bar */}
      {file && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-primary)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '8px',
            fontSize: '12px',
            color: 'var(--accent)'
          }}
        >
          <span>📎 {file.name} ({Math.round(file.size / 1024)} KB)</span>
          <button
            type="button"
            onClick={clearFile}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <button
          type="button"
          className="btn-icon"
          title="Attach file/image"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip size={18} />
        </button>

        <input
          type="text"
          value={content}
          onChange={handleTyping}
          placeholder="Type a message..."
          style={{
            flex: 1,
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 18px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none'
          }}
        />

        <button
          type="submit"
          disabled={sending || (!content.trim() && !file)}
          style={{
            background: 'var(--accent)',
            border: 'none',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: sending ? 'not-allowed' : 'pointer',
            opacity: sending || (!content.trim() && !file) ? 0.6 : 1,
            transition: 'transform 0.15s ease'
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
