import { prisma } from '../lib/prisma';

export default {
  async createRefreshToken(token_hash: string, utilizador_id: string, expira_em: Date) {
    return prisma.refreshToken.create({
      data: {
        token_hash,
        utilizador_id,
        expira_em,
      },
    });
  },

  async findRefreshToken(token_hash: string) {
    return prisma.refreshToken.findUnique({
      where: {
        token_hash,
      },
    });
  },

  async deleteRefreshToken(token_hash: string) {
    return prisma.refreshToken.delete({
      where: {
        token_hash,
      },
    });
  },

  async deleteExpiredTokens() {
    return prisma.refreshToken.deleteMany({
      where: {
        expira_em: {
          lt: new Date(),
        },
      },
    });
  },
};
