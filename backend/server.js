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

app.listen(5020, () => {
  console.log('server started');
});
