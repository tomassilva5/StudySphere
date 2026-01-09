import { Router } from "express";
import grupoController from "../../controllers/grupo.controller";
import messagesRoutes from "./messages.routes";

const router = Router();

router.get("/", grupoController.getUserGroups);
router.get("/:id", grupoController.getGroupById);
router.post("/", grupoController.createGrupo);
router.delete("/:id/leave", grupoController.leaveGrupo);
router.post("/members", grupoController.addMembers);

// Messages subroute
router.use("/:id/messages", messagesRoutes);

export default router;
