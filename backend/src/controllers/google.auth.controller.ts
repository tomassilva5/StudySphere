import { Request, Response } from 'express';
import oauth2Client from '../helpers/google';
import { prisma } from '../lib/prisma';
import { google } from 'googleapis';

export default {
  async auth(req: Request, res: Response) {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    res.redirect(url);
  },

  async callback(req: Request, res: Response) {
    const { code } = req.query;

    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);

      const userId = req.user!.id;

      await prisma.utilizador.update({
        where: { id: userId },
        data: {
          google_access_token: tokens.access_token,
          google_refresh_token: tokens.refresh_token,
        },
      });

      res.redirect('/some-success-page'); 
    } catch (error) {
      console.error('Error getting tokens', error);
      res.status(500).send('Error during authentication');
    }
  },
};
