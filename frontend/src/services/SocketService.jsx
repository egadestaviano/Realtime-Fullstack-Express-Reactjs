import { io } from 'socket.io-client';

let socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000');
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized!');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};