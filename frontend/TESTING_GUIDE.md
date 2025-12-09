# 🧪 Modo de Teste - Autenticação Mock

## Como Testar a Aplicação Sem Backend

### 📋 Passos

1. **Aceda à página de loading** (`http://localhost:3000`)
   - Verá a logo e a roda de carregamento

2. **Clique no botão "🧪 Dev"** (canto superior direito)
   - Aparecem 2 botões de teste:
     - ✓ Simular Login
     - → Ir para Login

3. **Clique em "✓ Simular Login"**
   - Será armazenado um token simulado em `localStorage`
   - Será redirecionado para o `/dashboard`
   - Agora tem acesso a todas as rotas protegidas!

4. **Navegue entre as páginas**
   - Dashboard
   - Tarefas
   - Calendário
   - Configurações

5. **Para fazer logout**
   - Vá para Settings
   - Clique em "Sair"
   - Será redirecionado para `/login`

---

## 🔧 Como Funciona Internamente

### Token Simulado
```typescript
// Guardado em localStorage
localStorage.setItem('authToken', 'test-token-12345');
```

### Verificação de Autenticação
O `AuthContext` verifica se existe token em `localStorage`:
```typescript
const token = localStorage.getItem('authToken');
if (token) {
  setIsAuthenticated(true);
}
```

### Proteção de Rotas
O `middleware.ts` verifica se tem token antes de aceder a rotas protegidas:
```typescript
if (!token && protectedRoutes.includes(pathname)) {
  // Redireciona para login
}
```

---

## ✅ O Que Pode Testar

- [x] Redirecionamento automático de `/` para `/loading`
- [x] Login simulado na página de loading
- [x] Acesso a rotas protegidas (dashboard, tarefas, calendário, settings)
- [x] BottomTabs aparece apenas em rotas protegidas
- [x] Logout funciona e redireciona para login
- [x] Navegação entre abas usando BottomTabs

---

## 🚀 Quando Integrar com Backend

Quando a equipa do backend terminar a autenticação:

1. **Substituir login simulado** pela chamada real à API:
```typescript
const handleLogin = async (email: string, password: string) => {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const { token } = await response.json();
  login(token);
  router.push('/dashboard');
};
```

2. **Remover botões de teste** da página de loading

3. **Implementar página de login/register** com formulário real

---

## 📝 Notas Importantes

- O token simulado é guardado apenas em `localStorage` (não persiste após limpar cache)
- O token não é validado com backend (é apenas para testes de UI)
- Quando implementar backend, pode substituir `login()` pela resposta real da API
- O logout funciona normalmente (limpa `localStorage`)

---

## 🐛 Troubleshooting

**P: Cliquei em "Simular Login" mas não funcionou**
- Verifique se está em `http://localhost:3000` (não localhost:3001, etc)
- Limpe o cache do navegador (`Ctrl+Shift+Delete`)
- Abra DevTools (`F12`) e verifique a consola por erros

**P: O BottomTabs não aparece**
- Verifique se fez logout corretamente
- Verifique se está em rota protegida (não em `/login` ou `/loading`)

**P: Não consigo aceder ao Dashboard diretamente**
- Sem token, o middleware redireciona para `/login`
- Use o botão "Simular Login" na página de loading

---

## 📚 Referências

- `src/app/loading/page.tsx` - Botões de teste
- `src/app/providers/AuthContext.tsx` - Lógica de autenticação
- `src/middleware.ts` - Proteção de rotas
- `src/app/layout.tsx` - Layout global com AuthProvider
