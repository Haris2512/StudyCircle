/**
 * Konfigurasi dan layanan klien Socket.IO untuk komunikasi real-time.
 */
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  joinGroup(groupId: string) {
    this.socket?.emit('join_group', groupId);
  }

  leaveGroup(groupId: string) {
    this.socket?.emit('leave_group', groupId);
  }

  joinUser(userId: string) {
    this.socket?.emit('join_user', userId);
  }

  sendMessage(studyGroupId: string, userId: string, content: string) {
    this.socket?.emit('send_message', { studyGroupId, userId, content });
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('new_message', callback);
  }

  offNewMessage() {
    this.socket?.off('new_message');
  }

  onNotification(callback: (notification: any) => void) {
    this.socket?.on('notification', callback);
  }

  offNotification() {
    this.socket?.off('notification');
  }
}

export const socketService = new SocketService();
