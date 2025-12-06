# 📱 Frontend - Sistema de Autenticação e Navegação

## 🎯 Estrutura Implementada

### 1. **AuthContext** (`src/app/providers/AuthContext.tsx`)
- Gerencia estado global de autenticação
- Armazena tokens em `localStorage`
- Funções: `login()`, `logout()`, `isAuthenticated`
- Hook: `useAuth()` para aceder em qualquer componente

### 2. **BottomTabs** (`src/app/components/BottomTabs.tsx`)
- Menu de tabs na parte **inferior** da tela
- Mostra apenas em rotas protegidas
- Ícones e navegação para: Dashboard, Tarefas, Calendário, Configurações
- Destaque visual na aba ativa

### 3. **Middleware** (`src/middleware.ts`)
- Proteção automática de rotas
- Se não tem token e tenta aceder a rota protegida → redireciona para `/login`
- Se tem token e tenta aceder a `/login` → redireciona para `/dashboard`

### 4. **Layout Global** (`src/app/layout.tsx`)
- Envolve tudo com `AuthProvider`
- Renderiza `BottomTabs` apenas em rotas protegidas
- Suporte a PWA com manifest

## 🔄 Fluxo de Autenticação

```
1. Acesso a / (root)
   ↓
2. Redireciona automático para /loading
   ↓
3. Loading verifica se tem token em localStorage (2 segundos)
   ↓
   ├─ SIM: Redireciona para /dashboard (com BottomTabs)
   └─ NÃO: Redireciona para /login (sem BottomTabs)
```

## 🔐 Integração com Backend

### Fazer Login
```typescript
// Em login/page.tsx (quando implementado)
const { login } = useAuth();

const handleLogin = async (email: string, password: string) => {
  const response = await fetch('http://seu-backend:3000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const { token } = await response.json();
  login(token);
  router.push('/dashboard');
};
```

### Fazer Logout
```typescript
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push('/login');
};
```

## 📁 Estrutura de Ficheiros

```
frontend/src/app/
├── page.tsx                    # Root → redireciona para /loading
├── layout.tsx                  # Layout global com AuthProvider
├── loading/page.tsx            # Página de loading
├── login/page.tsx              # Página de login (vazia, implementar)
├── register/page.tsx           # Página de registo (vazia, implementar)
├── dashboard/page.tsx          # Protegida, com BottomTabs
├── tasks/page.tsx              # Protegida, com BottomTabs
├── calendar/page.tsx           # Protegida, com BottomTabs
├── settings/page.tsx           # Protegida, com BottomTabs
├── components/
│   └── BottomTabs.tsx          # Menu de tabs na parte inferior
├── providers/
│   └── AuthContext.tsx         # Context de autenticação
└── globals.css                 # Estilos globais

middleware.ts                   # Proteção de rotas (na raiz de src/)
```

## 🎨 Design do BottomTabs

- **Posição**: Fixa na parte inferior
- **Altura**: 80px (h-20)
- **Ícones**: Emojis (📊 ✓ 📅 ⚙️)
- **Destaque**: Borda superior azul na aba ativa
- **Responsivo**: Funciona bem em mobile

## ✅ Funcionalidades Implementadas

- [x] AuthContext para gerenciar autenticação
- [x] BottomTabs com navegação
- [x] Middleware para proteção de rotas
- [x] Redirecionamento automático de /loading
- [x] Páginas protegidas com padding inferior
- [x] Função logout
- [x] Layout global com provider

## 🚀 Próximos Passos

1. **Implementar login/page.tsx** com formulário e chamada à API
2. **Implementar register/page.tsx** com validação
3. **Conectar com backend** para validar tokens
4. **Adicionar interceptor de API** para incluir token em requests
5. **Melhorar design** com cores e componentes customizados
6. **Adicionar notificações** de sucesso/erro

## 🔧 Configuração

Nenhuma configuração especial necessária. Tudo funciona out-of-the-box com o Next.js 16+.

Se precisar customizar:
- Tempo de loading: Editar timeout em `loading/page.tsx` (linha ~14)
- Rotas protegidas: Editar arrays em `middleware.ts`
- Estilos tabs: Editar classes em `BottomTabs.tsx`
