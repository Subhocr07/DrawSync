import Message from '../models/Message.js';
import Canvas from '../models/Canvas.js';
import User from '../models/User.js';

const roomName = (canvasId) => `canvas_${canvasId}`;
const roomUsers = new Map(); // room -> Map(userId -> { _id, fullName })

export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('join-canvas', async ({ canvasId, userId }) => {
      socket.join(roomName(canvasId));
      socket.data = { canvasId, userId };
      socket.emit('joined', { canvasId });
      try {
        if (userId) {
          await Canvas.findByIdAndUpdate(canvasId, { $addToSet: { participants: userId } });
          // presence tracking
          const user = await User.findById(userId).select('fullName');
          const room = roomName(canvasId);
          if (!roomUsers.has(room)) roomUsers.set(room, new Map());
          roomUsers.get(room).set(String(userId), { _id: userId, fullName: user?.fullName || 'User' });
          io.to(room).emit('presence', Array.from(roomUsers.get(room).values()));
        }
      } catch (_) {}
    });

    socket.on('draw-stroke', async ({ canvasId, stroke }) => {
      // Broadcast to others in the room
      socket.to(roomName(canvasId)).emit('draw-stroke', { stroke });
      try {
        await Canvas.findByIdAndUpdate(canvasId, { $push: { strokes: stroke } });
      } catch (_) {}
    });

    socket.on('clear-canvas', async ({ canvasId }) => {
      socket.to(roomName(canvasId)).emit('clear-canvas');
      try {
        await Canvas.findByIdAndUpdate(canvasId, { $set: { strokes: [] } });
      } catch (_) {}
    });

    socket.on('set-strokes', async ({ canvasId, strokes }) => {
      try {
        await Canvas.findByIdAndUpdate(canvasId, { $set: { strokes } });
        socket.to(roomName(canvasId)).emit('set-strokes', { strokes });
      } catch (_) {}
    });

    socket.on('chat-message', async ({ canvasId, userId, text }) => {
      const message = await Message.create({ canvas: canvasId, sender: userId, text });
      let sender = { _id: userId };
      try {
        const user = await User.findById(userId).select('fullName email');
        if (user) sender = { _id: user._id, fullName: user.fullName, email: user.email };
      } catch (_) {}
      io.to(roomName(canvasId)).emit('chat-message', {
        _id: message._id,
        text: message.text,
        sender,
        createdAt: message.createdAt,
      });
    });

    const leaveAll = () => {
      const { canvasId, userId } = socket.data || {};
      if (!canvasId || !userId) return;
      const room = roomName(canvasId);
      const users = roomUsers.get(room);
      if (users) {
        users.delete(String(userId));
        io.to(room).emit('presence', Array.from(users.values()));
      }
    };

    socket.on('disconnect', leaveAll);
    socket.on('leave-canvas', leaveAll);
  });
}


