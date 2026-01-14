import express, { Request, Response} from 'express'
import routes from './routes/index'
import cookieParser from 'cookie-parser'
import http from 'http';
import cors from 'cors';
import { authController, socketAuthMiddleware } from './controllers/auth.controller';
import { Server } from 'socket.io';
import { chatBatcher } from './helpers/chatbatching';
import { PORT, FRONTEND_URL } from './helpers/config'; 

const app = express()

app.use(express.json())
app.use(cookieParser())

// Allow the frontend origin and cookies for session auth
const allowedOrigins = [
  'https://study-sphere-idea.vercel.app',
  'http://localhost:5000',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}))

app.use("/api/v1", routes)

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"]
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
server.listen(PORT, () => { 
  console.log(`Server is running on ${PORT}`)
})

