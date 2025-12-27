import refreshDb from '../db/refresh.db';
import { hashToken } from '../helpers/auth';

export default {
  async createRefreshToken(userId: string, refreshToken: string) {
    const token_hash = await hashToken(refreshToken);
    const expira_em = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    return refreshDb.createRefreshToken(token_hash, userId, expira_em);
  },

  async findRefreshToken(refreshToken: string) {
    const token_hash = await hashToken(refreshToken);
    return refreshDb.findRefreshToken(token_hash);
  },

  async deleteRefreshToken(refreshToken: string) {
    const token_hash = await hashToken(refreshToken);
    return refreshDb.deleteRefreshToken(token_hash);
  },
};
