const express = require('express');
const { chats } = require('./data/data.js');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');

const { errorHandler, notFound } = require('./middleware/errorMiddleware.js');

const app = express();
dotenv.config();
connectDB();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5020;

const server = app.listen(5020, () => {
  console.log('server started');
});

const io = require('socket.io')(server, {
  pingTimeout: 50000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  socket.on('join chat', (chatID) => {
    socket.join(chatID);
    console.log('User Joined Room: ' + chatID);
  });

  socket.on('new message', (newMessageReceived) => {
    const { sender, chat, content } = newMessageReceived;

    if (!chat || !chat._id) {
      console.log('Chat information missing or invalid');
      return;
    }
    socket.to(chat._id).emit('message received', {
      sender,
      content,
      chat,
    });
  });

  socket.on('disconnect', () => {
    console.log('USER DISCONNECTED');
  });
});
