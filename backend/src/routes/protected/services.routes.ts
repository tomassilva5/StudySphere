import { Router } from "express";
import { authController } from "../../controllers/auth.controller";

const router = Router();

router.use(authController);

router.use("/user")

router.use("/chat")

router.use("/events")

router.use("/grupo")

export default router;
