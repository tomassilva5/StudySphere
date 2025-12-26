import { Router } from 'express';
import googleAuthController from '../controllers/google.auth.controller';

const router = Router();

router.get('/auth', googleAuthController.auth);
router.get('/callback', googleAuthController.callback);

export default router;
