import { API_URL } from '../src/conf/constnts';
import { io } from 'socket.io-client';
import { getStoredToken } from '../src/api/auth';

export const socket = io(API_URL, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
});

export const connectSocket = () => {
    const token = getStoredToken();
    socket.auth = { token };
    socket.connect();
};

export const disconnectSocket = () => {
    socket.disconnect();
};

// Optional: Add listeners for debugging connection status
socket.on('connect', () => {
    console.log('Socket connected to server:', socket.id);
});

socket.on('disconnect', () => {
    console.log('Socket disconnected from server');
});

socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
});
