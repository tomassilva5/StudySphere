FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
