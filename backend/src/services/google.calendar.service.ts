import { google } from 'googleapis';
import oauth2Client from '../helpers/google';
import { prisma } from '../lib/prisma';

export default {
  async listCalendars(userId: string) {
    const user = await prisma.utilizador.findUnique({
      where: { id: userId },
    });

    if (!user || !user.google_access_token) {
      throw new Error('User not authenticated with Google');
    }

    oauth2Client.setCredentials({
      access_token: user.google_access_token,
      refresh_token: user.google_refresh_token,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const res = await calendar.calendarList.list();
    return res.data.items;
  },
};
