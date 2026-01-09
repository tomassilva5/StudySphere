import { Router } from "express";
import userController from "../../controllers/user.controller";

const router = Router();

router.get("/search", userController.searchUsers)
router.get("/me", userController.getCurrentUser)
router.get("/", userController.getAll)
router.get("/:nome_utilizador", userController.getUser)
router.get("/:id", userController.getById)

export default router;
