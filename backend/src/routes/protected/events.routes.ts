import { Router } from "express";
import eventsController from "../../controllers/events.controller";

const router = Router();

router.post("/", eventsController.createEvent);
router.post("/group", eventsController.createGroupEvent);
router.get("/today", eventsController.getTodayEvents);
router.put("/:id", eventsController.modifyEvents);
router.delete("/:id", eventsController.deleteEvent);

export default router;
