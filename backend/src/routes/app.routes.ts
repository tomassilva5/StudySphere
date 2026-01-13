import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import authRoutes from './auth.routes';
import userRoutes from './protected/user.routes';
import chatRoutes from './protected/chat.routes';
import eventsRoutes from './protected/events.routes';
import grupoRoutes from './protected/grupo.routes';
import userController from "../controllers/user.controller";
import googleAuthController from '../controllers/google.auth.controller';
import googleRoutes from './protected/google.routes';

const router = Router();

router.get("/auth/check-availability", userController.checkAvailability); 
router.use('/auth', authRoutes);
// Callback do Google não precisa de autenticação (recebe state com userId)
router.get('/auth/google/callback', googleAuthController.callback);

router.get("/usersnames", userController.getUsernames);

router.use(authController);

// Auth do Google precisa de autenticação para obter o userId
router.get('/auth/google/auth', googleAuthController.auth);
router.use('/users', userRoutes);
router.use('/chat', chatRoutes);
router.use('/events', eventsRoutes);
router.use('/groups', grupoRoutes);
router.use('/google/calendar', googleRoutes);

export default router;