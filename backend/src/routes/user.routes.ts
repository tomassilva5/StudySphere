import { Router } from "express";
import userController from "../controllers/user.controller";

const router = Router();

router.get("/getusers", userController.getAll)
router.get("/getuser", userController.getUser)
router.post("/create", userController.create)


export default router;
