import { Request, Response } from 'express';
import googleCalendarService from '../services/google.calendar.service';

export default {
  async getCalendars(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const calendars = await googleCalendarService.listCalendars(userId);
      return res.status(200).json(calendars);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async getEvents(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { calendarId } = req.query;
      
      const events = await googleCalendarService.getEvents(
        userId,
        calendarId as string | undefined
      );
      
      // Sincronizar automaticamente com a base de dados
      await googleCalendarService.syncEventsToDatabase(userId);
      
      return res.status(200).json(events);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async syncEvents(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const syncedEvents = await googleCalendarService.syncEventsToDatabase(userId);
      
      return res.status(200).json({
        message: `${syncedEvents.length} eventos sincronizados com sucesso`,
        events: syncedEvents,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};
