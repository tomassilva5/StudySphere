import express, { Request, Response} from 'express'
import routes from './routes/index'
import cookieParser from 'cookie-parser'
import http from 'http';
import { authController, socketAuthMiddleware } from './controllers/auth.controller';
import { Server } from 'socket.io';
import { chatBatcher } from './helpers/chatbatching';
import { PORT, FRONTEND_URL } from './helpers/config'; // Import PORT and FRONTEND_URL

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1", routes)

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL, // Use FRONTEND_URL from config
    credentials: true, 
  }
});

io.use(socketAuthMiddleware);
io.on('connection', (socket) => {
  const user = socket.data.user; 
  socket.on('join_room', (chatId) => {
    socket.join(chatId);
  });
  socket.on('send_message', (data) => {
    const senderId = user.id; 
    socket.to(data.chatId).emit('receive_message', {
        ...data,
        senderId: senderId
    });
    chatBatcher.add({
      chatId: data.chatId,
      senderId: senderId,
      content: data.content,
      timestamp: new Date()
    });
  });
});
server.listen(PORT, () => { // Use PORT from config
  console.log('Server is running')
})

