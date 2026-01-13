import { Request, Response } from 'express';
import oauth2Client from '../helpers/google';
import { prisma } from '../lib/prisma';
import { google } from 'googleapis';
import crypto from 'crypto';

// Armazenamento temporário de state tokens (em produção, usar Redis)
const stateTokens = new Map<string, { userId: string; expiresAt: number }>();

// Limpar tokens expirados a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of stateTokens.entries()) {
    if (data.expiresAt < now) {
      stateTokens.delete(token);
    }
  }
}, 5 * 60 * 1000);

export default {
  async auth(req: Request, res: Response) {
    // O userId virá do req.user (middleware de autenticação)
    const userId = req.user!.id;
    
    // Gerar token temporário único
    const stateToken = crypto.randomBytes(32).toString('hex');
    
    // Guardar mapeamento por 10 minutos
    stateTokens.set(stateToken, {
      userId,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: stateToken, // Passar o token no state
    });

    res.redirect(url);
  },

  async callback(req: Request, res: Response) {
    const { code, state } = req.query;

    try {
      // Validar e recuperar userId do state token
      const stateData = stateTokens.get(state as string);
      
      if (!stateData || stateData.expiresAt < Date.now()) {
        return res.status(400).send('Token de autenticação expirado ou inválido');
      }
      
      const userId = stateData.userId;
      
      // Remover token usado
      stateTokens.delete(state as string);
      
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);

      await prisma.utilizador.update({
        where: { id: userId },
        data: {
          google_access_token: tokens.access_token,
          google_refresh_token: tokens.refresh_token,
        },
      });

      res.redirect(`${process.env.FRONTEND_URL}/settings?googleConnected=true`); 
    } catch (error) {
      console.error('Error getting tokens', error);
      res.status(500).send('Error during authentication');
    }
  },
};

export { stateTokens };
