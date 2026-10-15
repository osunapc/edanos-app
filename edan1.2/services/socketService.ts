import { API_URL } from '@/confg/constants';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string) => {
  if (socket && socket.connected) {
    console.log('Socket already connected.');
    return socket;
  }

  socket = io(API_URL, {
    autoConnect: false,
    auth: {
      token: token,
    },
  });

  socket.connect();

  socket.on('connect', () => {
    console.log('Socket connected to server:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected from server');
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
