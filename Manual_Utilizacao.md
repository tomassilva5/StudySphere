# Manual de Utilização – StudySphere

> **Dica importante**: Testa a app preferencialmente no telemóvel para veres a experiência completa com a barra de navegação. Se testares no PC, abre as ferramentas de desenvolvedor (F12) e simula um ecrã mobile para a melhor experiência.

---

## Começar

1. Abre `http://localhost:3000` no browser.
2. **Registar**: preenche nome completo, username, email e password (mínimo 8 caracteres, com maiúsculas, minúsculas e números).
3. **Login**: usa email ou username + password. Os cookies mantêm-te autenticado enquanto a sessão for válida.

---

## Navegação Geral

A barra inferior mostra 4 atalhos principais:

- **Home (Dashboard)**: visão geral do dia com calendário e distribuição de tempo por categoria.
- **Tarefas**: lista de tarefas do dia selecionado, com filtros por tipo.
- **Grupos**: acesso aos teus grupos, tarefas em comum e chat em tempo real.
- **Configurações**: perfil, Google Calendar, alterar password, logout.

A barra desaparece em ecrãs de login, registro, calendário dedicado ou quando abres modais para focares melhor.

---

## Dashboard

**O que vês:**
- **Calendário interativo**: clica num dia qualquer para o selecionares.
- **Distribuição de tempo**: barra que mostra quantas horas tens em cada tipo de tarefa (Aulas, Estudo Individual, Grupo, Eventos Pessoais, Lazer).
- A distribuição atualiza automaticamente consoante o dia que escolhes.

**Dica**: usa o calendário para ter uma visão rápida da tua semana e do que vem aí.

---

## Tarefas Pessoais

**Ver tarefas do dia:**
- Por padrão, vês as tarefas de hoje.
- Usa as setas `<` e `>` junto à data para navegar entre dias.
- Os filtros no topo (TODAS, AULAS, INDIVIDUAL, GRUPO) mostram-te apenas tarefas desse tipo para o dia selecionado.
- O contador ao lado de cada filtro atualiza consoante o dia que escolhes.

**Adicionar:**
- Clica no botão `+` (fica fixo enquanto scrollas).
- Preenche: título (obrigatório), tipo, data, horas início/fim, prioridade, descrição (opcional).
- Clica "Adicionar".

**Concluir/Reabrir:**
- Clica no quadrado à esquerda de cada tarefa.
- Se a rede cair, a tarefa volta automaticamente ao estado anterior (rollback automático).

**Editar/Eliminar:**
- **Editar**: ícone de lápis (ainda em desenvolvimento, leva a uma página temporária).
- **Eliminar**: ícone de lixo. Abre um modal a pedir confirmação com botão vermelho "Sim, apagar tarefa".

**Nota sobre Google Calendar:**
- Se sincronizaste Google Calendar (em Configurações), vês eventos do Google como tarefas read-only (não podes editá-los nem apagá-los aqui).

---

## Grupos

**Entrar num grupo:**
- Clica em "Grupos" na barra inferior.
- Escolhe um grupo da lista.

**Tarefas de Grupo:**
- Cria, conclui ou apaga tarefas como nas tarefas pessoais, mas estas são partilhadas com todos os membros do grupo.
- Todos veem as mudanças em tempo real.
- O botão `+` fica fixo no canto inferior direito.

**Chat:**
- Muda para a aba "Chat".
- Escreve mensagens em tempo real com os membros do grupo.
- O chat precisa de uma ligação WebSocket ativa (se desligares a rede, vês a mensagem "Modo offline").
- Quando abres o chat, a barra inferior desaparece para teres mais espaço.

---

## Calendário (Google)

**Antes:**
1. Vai a **Configurações** (engrenagem no canto inferior direito).
2. Clica "Sincronizar Calendários".
3. Clica "Conectar com Google" e autoriza a app a aceder ao teu calendário.
4. Regressas automaticamente a Configurações com a mensagem "Calendário sincronizado!" (notificação verde a desaparecer ao fim de 3 segundos).

**Depois:**
- A sync acontece a cada ~2 minutos automaticamente.
- Podes forçar uma atualização manual clicando "Atualizar sincronização".
- Os eventos do Google aparecem nas Tarefas como read-only (só leitura).

---

## Conta e Segurança (Configurações)

**Alterar Password:**
1. Clica em "Alterar palavra-passe".
2. O username aparece bloqueado (read-only) para confirmares quem és.
3. Preenche "Nova Palavra-passe" e "Confirmar".
4. A app mostra um checklist enquanto escreves:
   - ✓ Mínimo 8 caracteres
   - ✓ Maiúsculas e minúsculas
   - ✓ Pelo menos um número
5. Se tudo estiver certo, o botão "Guardar Alterações" fica disponível.
6. Após sucesso, vês uma notificação verde: "Palavra-passe alterada com sucesso!" (desaparece ao fim de 3 segundos).

**Logout:**
- Clica "Terminar sessão" na secção de Conta.
- Abre um modal pedindo confirmação com botão vermelho "Sim, terminar sessão".
- Regressas ao login.

---

## Notificações

- Ícone de sino no topo-direita mostra quantas notificações não lidas tens.
- Clica para ver o histórico (página em evolução, mas já funcional).

---

## Resolução de Problemas

**Tarefas não aparecem após criar:**
- Verifica se a data está correta.
- Faz refresh à página (Ctrl+R).
- Confirma que tens ligação à internet.

**Login falha:**
- Podes entrar com email ou username (tenta ambos se um falhar).
- Verifica se o browser não está a bloquear cookies de terceiros (Settings > Privacidade > Cookies).

**Google Calendar não sincroniza:**
- Confirma que fizeste logout e login no Google.
- Tenta "Atualizar sincronização" em Configurações.
- Se ainda não funcionar, desliga e volta a ligar o Google Calendar em Configurações.

**Chat sem tempo real:**
- Verifica firewall/rede.
- Tenta refresh à página.
- Se continuares offline, vês a mensagem "Modo offline" com um ponto vermelho junto a "Chat em tempo real".

**Aplicação muito lenta ou trava:**
1. Faz refresh (Ctrl+R).
2. Tenta limpar cache do browser.
3. Último recurso: reinicia os containers:
   ```bash
   docker compose down
   docker compose up --build -d
   ```

---

## Dicas de Teste

- **Permissões**: cria dois utilizadores e testa um como membro de um grupo e outro fora dele.
- **Modo offline**: desliga a rede e tenta concluir uma tarefa para veres o rollback automático.
- **Validação de password**: tenta diferentes passwords para veres as mensagens de erro.
- **Google Calendar**: depois de conectar, cria um evento novo no Google Calendar e sincroniza para confirmar que aparece.
- **Responsividade**: testa no telemóvel e no PC com F12 aberto para veres a UI adaptar-se.
- **Navegação entre dias**: muda de dia na página de tarefas e dashboard para veres a filtragem e atualização em tempo real.

---

## Contacto / Suporte

Se encontrares bugs ou tiveres dúvidas, avisa!
