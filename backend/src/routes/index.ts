import { Router } from "express";
import app  from './app.routes';
const router = Router();
router.use("/", app)
export default router;