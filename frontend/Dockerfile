FROM node:22

WORKDIR /app
COPY package*.json ./
# Clean, deterministic install with binaries for this platform
RUN npm ci --ignore-scripts=false \
	&& npm rebuild lightningcss || true

COPY . .
EXPOSE 5000
CMD node server.js