import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import authRoutes from './auth.routes';
import userRoutes from './protected/user.routes';
import chatRoutes from './protected/chat.routes';
import eventsRoutes from './protected/events.routes';
import grupoRoutes from './protected/grupo.routes';
import userController from "../controllers/user.controller";

import googleAuthRoutes from './google.routes';
import googleRoutes from './protected/google.routes';

const router = Router();

// Public routes
router.use('/auth', authRoutes);
router.use('/auth/google', googleAuthRoutes);
router.get("/usersnames", userController.getUsernames);
router.get("/users/:nome_utilizador", userController.getUser);

// Protected routes
router.use(authController);

router.use('/users', userRoutes);
router.use('/chat', chatRoutes);
router.use('/events', eventsRoutes);
router.use('/groups', grupoRoutes);
router.use('/google/calendar', googleRoutes);

export default router;