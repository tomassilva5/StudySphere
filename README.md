# StudySphere 📚

**StudySphere** é uma aplicação web moderna para gestão académica que permite aos estudantes organizar tarefas, criar grupos de estudo, gerir eventos no calendário e colaborar em tempo real através de chat.

## 🎯 Funcionalidades

- **Autenticação Segura**: Sistema completo de login/register com JWT (access + refresh tokens)
- **Gestão de Tarefas**: Criar, editar e acompanhar tarefas académicas
- **Grupos de Estudo**: Criar e participar em grupos colaborativos
- **Calendário de Eventos**: Sincronização com Google Calendar para gerir compromissos
- **Chat em Tempo Real**: WebSocket com Socket.IO para comunicação instantânea
- **Interface Responsiva**: Design moderno e adaptável a dispositivos móveis

## 🏗️ Arquitetura

### Stack Tecnológico

**Frontend:**
- Next.js 16.0.7 (React 19.2)
- TypeScript 5
- Tailwind CSS 4
- Socket.IO Client
- Custom Node.js Server com Proxy (http-proxy-middleware)

**Backend:**
- Node.js 22 com Express 5.1
- TypeScript
- Prisma 6.19 (ORM)
- MongoDB Atlas (Database)
- Socket.IO (WebSocket)
- JWT para autenticação
- bcryptjs para hash de passwords

**DevOps:**
- Docker & Docker Compose
- Containers isolados (frontend:5000, backend:3000)

## 📁 Estrutura do Projeto

```
study_sphere/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Lógica de autenticação
│   │   ├── db/                # Camada de acesso a dados
│   │   ├── helpers/           # Configurações e utilitários
│   │   ├── lib/               # Prisma client
│   │   ├── routes/            # Rotas da API
│   │   ├── services/          # Lógica de negócio
│   │   └── types/             # TypeScript types e DTOs
│   ├── prisma/
│   │   └── schema.prisma      # Schema da base de dados
│   ├── Dockerfile
│   ├── package.json
│   └── .env                   # Variáveis de ambiente
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── components/    # Componentes UI reutilizáveis
│   │       ├── providers/     # Context API (Auth, Tasks)
│   │       ├── calendar/      # Página de calendário
│   │       ├── dashboard/     # Dashboard principal
│   │       ├── groups/        # Gestão de grupos
│   │       ├── tasks/         # Gestão de tarefas
│   │       ├── settings/      # Configurações do utilizador
│   │       ├── login/         # Autenticação
│   │       └── register/      # Registo de utilizadores
│   ├── server.js              # Servidor custom com proxy
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml         # Orquestração de containers
└── README.md
```

## 🔧 Pré-requisitos

- [Docker](https://www.docker.com/get-started) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+
- MongoDB Atlas Account (ou MongoDB local)

## ⚙️ Configuração

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd study_sphere
```

### 2. Configurar Variáveis de Ambiente

#### Backend (.env)

Crie/edite o ficheiro `backend/.env`:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/studysphere?retryWrites=true&w=majority"

# JWT Secrets (altere para valores seguros em produção)
JWT_SECRET=your_jwt_secret_here
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Token Expiration
ACCESS_TOKEN_EXP=15m
REFRESH_TOKEN_EXP=7d

# Server
PORT=3000
FRONTEND_URL=http://localhost:5000
```

**Importante:** Substitua `username`, `password` e `cluster` pelos seus dados do MongoDB Atlas.

### 3. MongoDB Atlas Setup

1. Aceda a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Configure IP Whitelist: `0.0.0.0/0` (permitir todos - apenas desenvolvimento)
4. Crie um utilizador de base de dados
5. Copie a connection string para `DATABASE_URL` no `.env`

## 🚀 Como Executar

### Iniciar a Aplicação

```bash
# Build e start dos containers
docker compose up -d --build

# Verificar status
docker ps

# Ver logs
docker compose logs -f
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:3000

### Comandos Úteis

```bash
# Parar containers
docker compose down

# Reconstruir apenas backend
docker compose up -d --build backend

# Reconstruir apenas frontend
docker compose up -d --build frontend

# Ver logs do backend
docker compose logs backend -f

# Ver logs do frontend
docker compose logs frontend -f

# Reiniciar serviços
docker compose restart
```

## 📡 API Endpoints

### Autenticação

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### Eventos (requer autenticação)

```
GET  /api/v1/events/today
POST /api/v1/events
PUT  /api/v1/events/:id
DELETE /api/v1/events/:id
```

### Grupos (requer autenticação)

```
GET  /api/v1/groups
POST /api/v1/groups
GET  /api/v1/groups/:id
PUT  /api/v1/groups/:id
DELETE /api/v1/groups/:id
```

### Utilizadores (requer autenticação)

```
GET  /api/v1/users/me
PUT  /api/v1/users/me
```

### Chat (WebSocket)

```
ws://localhost:3000
- Eventos: message, join_room, leave_room
```

## 🔐 Sistema de Autenticação

### Como Funciona

1. **Register/Login**: Utilizador cria conta ou faz login
2. **Tokens JWT**: Backend gera dois tokens:
   - `accessToken`: Validade de 15 minutos (usado para pedidos autenticados)
   - `refreshToken`: Validade de 7 dias (usado para renovar o accessToken)
3. **Cookies HttpOnly**: Tokens armazenados em cookies seguros (não acessíveis via JavaScript)
4. **Middleware de Autenticação**: Valida o accessToken em todas as rotas protegidas
5. **Refresh Automático**: Frontend renova automaticamente o accessToken quando expira

### Segurança

- Passwords hasheadas com bcryptjs
- Cookies com flags: `HttpOnly`, `SameSite=Lax`
- JWT assinados com secrets fortes
- CORS configurado para permitir credenciais

## 🔄 Arquitetura de Proxy

O frontend usa um servidor Node.js customizado (`server.js`) que:

1. Serve a aplicação Next.js
2. Proxy de `/api/v1/*` para `backend:3000`
3. Garante que cookies são corretamente enviados/recebidos
4. Evita problemas de CORS ao manter mesma origem (localhost:5000)

```javascript
// Fluxo de Requisição
Browser → localhost:5000/api/v1/events → Proxy → backend:3000/api/v1/events → Response
```

## 🗄️ Schema da Base de Dados

### User
- `id`: String (MongoDB ObjectId)
- `email`: String (único)
- `username`: String (único)
- `nome`: String
- `password`: String (hashed)
- `googleId`: String? (opcional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Event
- `id`: String
- `titulo`: String
- `descricao`: String?
- `data`: DateTime
- `tipo`: String
- `userId`: String (FK → User)
- `googleEventId`: String?
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Grupo
- `id`: String
- `nome`: String
- `descricao`: String?
- `createdAt`: DateTime
- `membros`: User[] (relação many-to-many)

### RefreshToken
- `id`: String
- `token`: String (único)
- `userId`: String (FK → User)
- `createdAt`: DateTime

## 🧪 Testar a Aplicação

1. Aceda a http://localhost:5000
2. Clique em "Registar" e crie uma conta
3. Faça login com as credenciais criadas
4. Explore as funcionalidades:
   - Dashboard: Visão geral
   - Tasks: Criar/editar tarefas
   - Groups: Criar grupos de estudo
   - Calendar: Visualizar eventos
   - Settings: Editar perfil

## 🐛 Troubleshooting

### Problema: Containers não iniciam

```bash
# Verificar logs
docker compose logs

# Reconstruir completamente
docker compose down
docker compose up -d --build
```

### Problema: Erro de conexão MongoDB

- Verifique se o IP está na whitelist do MongoDB Atlas
- Confirme que a connection string está correta no `.env`
- Teste a conexão diretamente com MongoDB Compass

### Problema: 401 Unauthorized

- Limpe os cookies do navegador (F12 → Application → Cookies)
- Faça logout e login novamente
- Verifique se os tokens não expiraram

### Problema: Frontend não carrega

```bash
# Verificar logs do frontend
docker compose logs frontend -f

# Reconstruir frontend
docker compose up -d --build frontend
```

### Problema: Mudanças no código não refletem

```bash
# Para mudanças no backend (TypeScript precisa compilar)
docker compose up -d --build backend

# Para mudanças no frontend
docker compose restart frontend
```

## 🤝 Contribuir

1. Fork o projeto
2. Crie uma branch para a feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit as mudanças (`git commit -m 'Adicionar NovaFuncionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é desenvolvido para fins académicos.

## 👥 Autores

- Equipa de desenvolvimento StudySphere

## 📞 Suporte

Para questões e suporte, contacte através dos issues do repositório.

---

**Desenvolvido com ❤️ para otimizar a gestão académica**
