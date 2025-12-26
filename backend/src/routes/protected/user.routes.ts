import { Router } from "express";
import userController from "../../controllers/user.controller";

const router = Router();

router.get("/", userController.getAll)
router.get("/:id", userController.getById)

export default router;
