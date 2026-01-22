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
const baseAllowedOrigins = [
  'https://study-sphere-idea.vercel.app',
  'http://localhost:5000',
  'http://localhost:3000',
  FRONTEND_URL?.replace(/\/$/, '') || undefined,
].filter(Boolean) as string[];

const isAllowedOrigin = (origin?: string | null) => {
  if (!origin) return true; // allow non-browser clients
  const cleaned = origin.replace(/\/$/, '');
  if (baseAllowedOrigins.includes(cleaned)) return true;
  // allow any vercel preview/production domains
  try {
    const hostname = new URL(cleaned).hostname;
    if (/\.vercel\.app$/i.test(hostname)) return true;
  } catch (err) {
    console.warn('Invalid origin format', origin, err);
  }
  return false;
};

app.use(cors({
  origin: function(origin, callback) {
    if (isAllowedOrigin(origin)) return callback(null, true);
    console.warn('Blocked CORS origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}))

app.use("/api/v1", routes)

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      if (isAllowedOrigin(origin)) return callback(null, true);
      console.warn('Blocked Socket.io origin:', origin);
      return callback(new Error('Not allowed by CORS for socket'));
    },
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

