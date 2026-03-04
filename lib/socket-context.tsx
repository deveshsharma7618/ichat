"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (data: Message) => void;
  emitTyping: (conversationId: string, userId: string) => void;
  emitStopTyping: (conversationId: string, userId: string) => void;
  markMessagesRead: (conversationId: string, userId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  joinConversation: () => {},
  leaveConversation: () => {},
  sendMessage: () => {},
  emitTyping: () => {},
  emitStopTyping: () => {},
  markMessagesRead: () => {},
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, userId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000,
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      
      // Emit user online status if userId is available
      if (userId) {
        socketInstance.emit('user-online', userId);
      }
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('user-status', ({ userId, status }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        if (status === 'online') {
          updated.add(userId);
        } else {
          updated.delete(userId);
        }
        return updated;
      });
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('Socket connection error:', error.message);
      setIsConnected(false);
    });

    socketInstance.on('reconnect_failed', () => {
      console.warn('Socket reconnection failed');
      setIsConnected(false);
    });

    socketInstance.on('error', (error) => {
      console.warn('Socket error:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, [userId]);

  // Update user online status when userId changes
  useEffect(() => {
    if (socket && isConnected && userId) {
      socket.emit('user-online', userId);
    }
  }, [socket, isConnected, userId]);

  const joinConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('join-conversation', conversationId);
    }
  }, [socket, isConnected]);

  const leaveConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-conversation', conversationId);
    }
  }, [socket, isConnected]);

  const sendMessage = useCallback((data: Message) => {
    if (socket && isConnected) {
      const conversationId = [data.sender, data.recipient].sort().join('_');
      socket.emit('send-message', {
        ...data,
        conversationId,
      });
    }
  }, [socket, isConnected]);

  const emitTyping = useCallback((conversationId: string, userId: string) => {
    if (socket && isConnected) {
      socket.emit('typing', { conversationId, userId });
    }
  }, [socket, isConnected]);

  const emitStopTyping = useCallback((conversationId: string, userId: string) => {
    if (socket && isConnected) {
      socket.emit('stop-typing', { conversationId, userId });
    }
  }, [socket, isConnected]);

  const markMessagesRead = useCallback((conversationId: string, userId: string) => {
    if (socket && isConnected) {
      socket.emit('messages-read', { conversationId, userId });
    }
  }, [socket, isConnected]);

  const value: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    joinConversation,
    leaveConversation,
    sendMessage,
    emitTyping,
    emitStopTyping,
    markMessagesRead,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
