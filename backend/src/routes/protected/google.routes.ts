import { Router } from 'express';
import googleAuthController from '../../controllers/google.auth.controller';
import googleCalendarService from '../../services/google.calendar.service';
import { Request, Response } from 'express';

const router = Router();

router.get('/calendars', async (req: Request, res: Response) => {
  try {
    const calendars = await googleCalendarService.listCalendars(req.user!.id);
    res.json(calendars);
  } catch (error) {
    res.status(500).json({ message: 'Error listing calendars', error });
  }
});

export default router;
