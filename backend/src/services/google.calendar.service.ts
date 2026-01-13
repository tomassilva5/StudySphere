import { google } from 'googleapis';
import oauth2Client from '../helpers/google';
import { prisma } from '../lib/prisma';

export default {
  async refreshTokenIfNeeded(userId: string) {
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

    // Se o token expirou, o googleapis automaticamente usa o refresh_token
    // Vamos capturar o novo token se for atualizado
    oauth2Client.on('tokens', async (tokens) => {
      if (tokens.access_token) {
        await prisma.utilizador.update({
          where: { id: userId },
          data: {
            google_access_token: tokens.access_token,
            google_refresh_token: tokens.refresh_token || user.google_refresh_token,
          },
        });
      }
    });

    return oauth2Client;
  },

  async listCalendars(userId: string) {
    const auth = await this.refreshTokenIfNeeded(userId);
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.calendarList.list();
    return res.data.items;
  },

  async getEvents(userId: string, calendarId: string = 'primary') {
    const auth = await this.refreshTokenIfNeeded(userId);
    const calendar = google.calendar({ version: 'v3', auth });

    // Buscar eventos dos próximos 30 dias
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const res = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return res.data.items || [];
  },

  async syncEventsToDatabase(userId: string) {
    const googleEvents = await this.getEvents(userId);
    const syncedEvents = [];

    for (const gEvent of googleEvents) {
      if (!gEvent.id || !gEvent.summary) continue;

      const googleEventId = gEvent.id;
      const startTime = gEvent.start?.dateTime || gEvent.start?.date;
      const endTime = gEvent.end?.dateTime || gEvent.end?.date;

      if (!startTime || !endTime) continue;

      // Verificar se evento já existe na BD
      const userEvents = await prisma.evento.findMany({
        where: {
          utilizador_id: userId,
        },
      });

      const existingEvent = userEvents.find((event: any) => {
        return event.sincronizacao_externa?.googleEventId === googleEventId;
      });

      const eventoData = {
        titulo: gEvent.summary,
        descricao: gEvent.description || null,
        data_inicio: new Date(startTime),
        data_fim: new Date(endTime),
        e_virtual: gEvent.hangoutLink ? true : false,
        link_reuniao: gEvent.hangoutLink || null,
        prioridade: 'MEDIA' as const,
        estado: 'agendado' as const,
        utilizador_id: userId,
        categoria: 'Universidade' as const,
        sincronizacao_externa: {
          source: 'google_calendar',
          googleEventId: gEvent.id,
          etag: gEvent.etag,
          htmlLink: gEvent.htmlLink,
          organizer: gEvent.organizer,
          lastSync: new Date().toISOString(),
        },
      };

      if (existingEvent) {
        // Atualizar evento existente
        const updated = await prisma.evento.update({
          where: { id: existingEvent.id },
          data: eventoData,
        });
        syncedEvents.push(updated);
      } else {
        // Criar novo evento
        const created = await prisma.evento.create({
          data: eventoData,
        });
        syncedEvents.push(created);
      }
    }

    return syncedEvents;
  },
};
