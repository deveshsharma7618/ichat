const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Track online users: userId -> socket.id
  const onlineUsers = new Map();

  io.on('connection', (socket) => {

    // User comes online
    socket.on('user-online', (userId) => {
      onlineUsers.set(userId, socket.id);
      
      // Broadcast online status to all clients
      io.emit('user-status', { 
        userId, 
        status: 'online' 
      });
    });

    // Join a conversation room (identified by sorted emails)
    socket.on('join-conversation', (conversationId) => {
      socket.join(conversationId);
    });

    // Leave a conversation room
    socket.on('leave-conversation', (conversationId) => {
      socket.leave(conversationId);
    });

    // Send message - broadcast to conversation room
    socket.on('send-message', (data) => {
      const { conversationId, sender, recipient, content, timestamp } = data;
      
      
      // Broadcast to everyone in the conversation room (including sender)
      io.to(conversationId).emit('receive-message', {
        sender,
        recipient,
        content,
        timestamp
      });

      // If receiver is online but not in the conversation, send notification
      const receiverSocketId = onlineUsers.get(recipient);
      if (receiverSocketId && !io.sockets.adapter.rooms.get(conversationId)?.has(receiverSocketId)) {
        io.to(receiverSocketId).emit('new-message-notification', {
          from: sender,
          message: content,
          conversationId
        });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { conversationId, userId } = data;
      socket.to(conversationId).emit('user-typing', {
        conversationId,
        userId,
        isTyping: true
      });
    });

    socket.on('stop-typing', (data) => {
      const { conversationId, userId } = data;
      socket.to(conversationId).emit('user-typing', {
        conversationId,
        userId,
        isTyping: false
      });
    });

    // Message read receipt
    socket.on('messages-read', (data) => {
      const { conversationId, userId } = data;
      socket.to(conversationId).emit('messages-read-by', {
        conversationId,
        userId
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      
      // Find and remove user from online users
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit('user-status', { 
            userId, 
            status: 'offline' 
          });
          break;
        }
      }
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
    });
});
