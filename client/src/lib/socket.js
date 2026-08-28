// client/src/lib/socket.js
import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
  : 'http://localhost:4000';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(URL, {
      auth: { token: localStorage.getItem('cc_token') || '' },
      autoConnect: true,
      transports: ['websocket'],
    });
  }
  // refresh token on reconnect
  socket.auth = { token: localStorage.getItem('cc_token') || '' };
  return socket;
}

export function joinConversation(id) {
  if (socket) socket.emit('conversation:join', id);
}
export function leaveConversation(id) {
  if (socket) socket.emit('conversation:leave', id);
}
export function emitTyping(conversationId, isTyping) {
  if (socket) socket.emit('typing', { conversationId, isTyping });
}
