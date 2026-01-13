import { Router } from 'express';
import googleCalendarController from '../../controllers/google.calendar.controller';

const router = Router();

router.get('/calendars', googleCalendarController.getCalendars);
router.get('/events', googleCalendarController.getEvents);
router.post('/sync', googleCalendarController.syncEvents);

export default router;
