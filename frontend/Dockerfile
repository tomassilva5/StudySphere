FROM node:22

WORKDIR /app

# Instalar dependências de build para módulos nativos
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Instalar dependências e recompilar lightningcss
RUN npm ci --ignore-scripts=false && \
    npm rebuild lightningcss

COPY . .
EXPOSE 5000
CMD node server.js