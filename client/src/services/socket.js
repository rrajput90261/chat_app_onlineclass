import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (user) => {
  if (!socket) {
    socket = io(window.location.origin, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('setup', user);
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
