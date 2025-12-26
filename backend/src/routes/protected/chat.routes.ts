import { Router } from "express";
import chatController from "../../controllers/chat.controller";

const router = Router();

router.post("/", chatController.createChat);
router.get("/", chatController.getChats);
router.get("/:chatId/messages", chatController.getMessages);
router.post("/messages", chatController.sendMessage);
router.post("/messages/read", chatController.markAsRead);

export default router;
