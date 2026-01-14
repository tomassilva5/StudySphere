## Manual de Utilização – StudySphere (guia rápido e direto)

> Teste preferencialmente no telemóvel para validar a navegação e a barra inferior.

>Podes também usar o computador com F12.

### 1. Antes de começar
- Abre o browser em `http://localhost:3000` (ou o URL que te deram).
- Cria conta em **Registar** (nome, username, email, password) ou entra com email *ou* username + password.
- Se a sessão cair, faz login outra vez; os cookies tratam do resto.

### 2. Para te orientares
- **Dashboard**: o teu “resumo do dia”.
- **Tasks**: as tuas tarefas pessoais (criar, concluir, editar, apagar).
- **Groups**: tarefas do grupo + chat em tempo real.
- **Calendar**: sincronização com Google Calendar.
- **Settings**: conta, Google, alterar password, logout.
- A barra inferior (BottomTabs) está quase sempre lá; desaparece em ecrãs de foco (login, register, modais, loading, calendar dedicado).

### 3. Tarefas pessoais (Tasks)
- **Adicionar**: botão “+” abre modal. Preenche título, data, hora início/fim, prioridade; descrição é opcional.
- **Concluir/Reabrir**: clica no ícone de check; se falhar, voltamos atrás automaticamente.
- **Editar**: ícone de lápis, com dados pré-preenchidos.
- **Eliminar**: ícone de lixo, com confirmação.
- **Google Calendar**: eventos vindos do Google são só leitura aqui.

### 4. Grupos (Groups)
- Escolhe um grupo para ver **Tarefas** e **Chat**.
- **Tarefas de grupo**: criar (botão “+”), concluir/reabrir, eliminar. Todos os membros veem as mudanças.
- **Chat**: mensagens em tempo real (precisas de ligação ativa).
- Com o modal aberto, escondemos a BottomTabs para evitar cliques acidentais.

### 5. Calendário (Google)
- Em **Settings**, clica “Sincronizar Calendários” e depois **Conectar com Google**. Autoriza a conta.
- Depois de ligado, sincroniza automático; podes forçar com “Atualizar sincronização”.
- Na página **Calendar**, o sync corre de ~2 em ~2 minutos e também pode ser manual.

### 6. Conta e segurança (Settings)
- **Alterar password**: em “Editar informações pessoais” vês o username bloqueado e dois campos: “Nova Palavra-passe” e “Confirmar”. Mínimo 8 caracteres; tens de preencher os dois para gravar.
- **Logout**: “Terminar sessão” e voltas ao login.

### 7. Notificações
- Ícone do sino no topo indica novidades; a página **Notificações** mostra o histórico (UI ainda em evolução, mas funcional).

### 8. Se algo correr mal
- **Login falhou**: confere credenciais; podes usar email ou username. Vê se o browser não está a bloquear cookies.
- **Google não sincroniza**: garante que autorizaste a conta e que estás autenticado; usa “Atualizar sincronização”.
- **Tarefas não mudam**: verifica a ligação; fazemos rollback se a API falhar. Dá refresh.
- **Chat sem tempo real**: a ligação WebSocket precisa de acesso a `http://<host>:3000` (firewall/rede).

### 9. Dicas para testar bem
- Usa duas contas para ver permissões de grupo (membro vs. não-membro).
- Marca/desmarca e apaga tarefas em offline (desliga a rede) para ver o rollback.
- Testa alteração de password com e sem confirmação para ver mensagens de erro.
- Liga ao Google, cria um evento no Google Calendar e força sync para confirmar a importação.

### 10. Plano de contingência
- Se algo não carregar, faz refresh.
- Se receberes 401/403, faz login de novo.
- Último recurso: reinicia os containers (`docker compose down` / `docker compose up --build -d`) e volta a entrar.