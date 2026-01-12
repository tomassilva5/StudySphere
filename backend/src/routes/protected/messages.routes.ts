import { Router } from "express";
import chatController from "../../controllers/chat.controller";

const router = Router({ mergeParams: true });

router.get("/", chatController.getGroupMessages);
router.post("/", chatController.sendMessage);

export default router;
