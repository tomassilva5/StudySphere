import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import user from './user.routes';

const router = Router();

router.use(authController);

router.use("/user", user);

export default router;