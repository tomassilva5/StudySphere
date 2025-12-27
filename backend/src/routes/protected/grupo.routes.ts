import { Router } from "express";
import grupoController from "../../controllers/grupo.controller";

const router = Router();

router.post("/", grupoController.createGrupo);
router.delete("/:id/leave", grupoController.leaveGrupo);
router.post("/members", grupoController.addMembers);

export default router;
