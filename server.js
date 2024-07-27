const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Load old messages from the database
  (async () => {
    try {
      const messages = await Message.find().sort({ createdAt: 1 });
      socket.emit('load old messages', messages);
    } catch (err) {
      console.error('Error loading old messages:', err);
    }
  })();

  // Listen for new messages
  socket.on('new message', async (data) => {
    try {
      const newMessage = new Message({ username: data.username, message: data.message });
      await newMessage.save();
      io.emit('new message', data);
    } catch (err) {
      console.error('Error saving new message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
