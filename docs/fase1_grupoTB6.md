## Indentificação do projeto

Nome: StudySphere

Tema: Aplicação criada para otimizar a organização académica e pessoal de estudantes universitários. 

Membros do grupo:
- Miguel Felgueiras Azevedo Nº:31392
- Francisco José Carvalhosa Fernandes Nº:31432
- Tomás de Sousa e Silva Nº:31373

Curso: Engenharia Informática 😎

Turma: 3º C

Data: 20/11/2025

Versão: 1.0

Contexto e Motivação
---

A StudySphere ajuda estudantes a gerir o tempo com um calendário unificado de aulas, prazos e compromissos, permitindo criar grupos, partilhar tarefas e eventos, e acompanhar atividades colaborativas.

**Conjunto de Potenciais Utilizadores**

Foi consultado um pequeno grupo de quatro potenciais utilizadores pessoalmente (estudantes) para identificar necessidades reais. Referiram dificuldades em gerir horários, prazos e tarefas dispersas entre várias plataformas, mostrando interesse numa aplicação unificada que simplifique a organização académica e pessoal.

Objetivos da Aplicação
---

A aplicação visa consolidar a gestão de tarefas académicas e pessoais com integração de ferramentas externas como Google Calendar e Outlook de modo a melhorar a produtividade estudantil. A aplicação permite também que estudantes criem e participem em grupos de estudo, partilhem tarefas e eventos, recebam notificações automáticas sobre alterações de colegas e consultem um histórico de atividades colaborativo.

Principais Utilizadores
---

| Tipo de Utilizador   | Descrição  | Principais Ações|
|---|---|---|
|Estudante |Utilizador que organiza as suas tarefas académicas e pessoais e participa de grupos de estudo. |Gere o seu tempo, cria e participa em grupos, partilha tarefas e eventos, recebe notificações sobre atividades do grupo.|

Requisitos Funcionais
---
- Registar e autenticar utilizadores.
- Integrar o horário escolar para ver as aulas que tenho.
- Calendário unificado com aulas, prazos de trabalhos e eventos pessoais.
- Sincronizar opcionalmente o meu calendário Google Calendar ou Outlook.
- Criar grupos de estudo com tarefas e eventos partilhados entre membros.
- Partilhar tarefas dentro de grupos (visualizar, editar, marcar como concluída, comentar)

### Requisitos Funcionais Adicionais


- Receber notificações automáticas para não falhar prazos nem eventos importantes.
- Reservar blocos de tempo no calendário. 
- Gerir tarefas com prioridade, estados e etiquetas.

Requisitos Não Funcionais
---

- Interface intuitiva e acessível para utilizadores com diferentes níveis de experiência tecnológica ou com necessidades especiais.
- Garantir que a app responde rapidamente às interações do utilizador.
- Disponibilidade elevada com tolerância mínima a falhas e recuperação automática.
- Capaz de suportar aumento no número de utilizadores, sem degradação no desempenho.
- Integração com ferramentas externas para otimizar o fluxo de trabalho dos estudantes. 
- Armazenar os dados dos utilizadores de forma segura.
- Assegurar que a app funciona em diferentes versões de sistemas operativos.

Modelo de Informação 
---

### Utilizadores
- **_id**: Identificador único do utilizador (ObjectId).
- **username**: Nome de utilizador único.
- **email**: Endereço de email do utilizador.
- **fullName**: Nome completo do utilizador.
- **passwordHash**: Hash da palavra-passe do utilizador.
- **avatar**: URL ou caminho para a imagem de perfil.
- **createdAt**: Data de criação do registo do utilizador.
- **externalCalendarId**: ID do calendário externo (e.g., Google Calendar, Outlook).
- **role**: Papel do utilizador (e.g., 'estudante', 'professor', ).
### Eventos 
- **_id**: Identificador único do evento (ObjectId).
- **title**: Título do evento.
- **description**: Descrição do evento.
- **startDate**: Data e hora de início do evento.
- **endDate**: Data e hora de fim do evento.
- **isVirtual**: Indica se o evento é virtual (Boolean).
- **meetingLink**: Link para reunião virtual, se aplicável.
- **priority**: Prioridade do evento (e.g., 'low', 'medium', 'high').
- **status**: Estado do evento (e.g., 'scheduled', 'in-progress', 'completed').
- **owner**: Referência ao utilizador que criou o evento (ObjectId).
- **category**: Categoria do evento (e.g., 'academic', 'personal').
- **tags**: Etiquetas para categorização.
- **isRecurring**: Indica se o evento é recorrente (Boolean).
- **recurrence**:
    - **frequency**: Frequência de recorrência (e.g., 'weekly', 'monthly').
    - **interval**: Intervalo de recorrência.
    - **endDate**: Data de fim da recorrência.
    - **daysOfWeek**: Dias da semana para eventos recorrentes.
- **externalSync**:
    - **isSynced**: Indica se o evento está sincronizado com um calendário externo (Boolean).
    - **externalEventId**: ID do evento no calendário externo.
### Grupos
- **_id**: Identificador único do grupo (ObjectId).
- **name**: Nome do grupo.
- **description**: Descrição do grupo.
- **members**: Lista de membros do grupo (ObjectId).
- **createdAt**: Data de criação do grupo.
- **events**: Lista de eventos associados ao grupo (ObjectId).
- **groupType**: Tipo de grupo (e.g., 'study', 'project').
### Histórico de Atividades:
- **_id:** Identificador único do registo (ObjectId).
- **user**: Referência ao utilizador (ObjectId).
- **action**: Ação realizada (e.g., 'event_created', 'task_completed').
- **details**: Detalhes adicionais sobre a ação.
- **timestamp**: Data e hora da ação.

Mockups / Wireframes
---
![Mockups](./imagens/mockups.png)

Os mockups foram mostrados a um estudante universitário. O utilizador achou a app fácil de navegar e apreciou a organização clara entre dashboard, tarefas e calendário. O único ponto negativo referido foi que o dashboard parece um pouco cheio, podendo beneficiar de um visual mais simples. No geral, o feedback foi positivo e confirma a utilidade da aplicação.

Validação Inicial
---

Para validar o conceito do StudySphere, foi realizado um questionário dirigido a estudantes, com o objetivo de compreender hábitos de organização, dificuldades e funcionalidades desejadas numa aplicação de gestão académica.

Principais conclusões do questionário:

A maioria dos participantes gere os horários através do calendário do telemóvel ou aplicações próprias como o Notion, embora alguns indiquem não ter um método organizado.

As maiores dificuldades identificadas foram esquecer prazos importantes, sobreposição de horários e dificuldade em conciliar estudo, lazer e vida pessoal.

As funcionalidades mais valorizadas pelos utilizadores foram o calendário unificado, notificações automáticas, integração com Google Calendar ou Outlook egestão de tarefas com prioridades e etiquetas.

Alguns participantes sugeriram que a aplicação fosse simples, intuitiva e com um dashboard mais claro.

O feedback recolhido através do questionário confirmou que existe uma necessidade real de uma aplicação capaz de centralizar horários, prazos e tarefas. As respostas ajudaram a priorizar funcionalidades e validaram a relevância da solução no contexto académico.

<img src="./imagens/pergunta.png" width="850" height="550"></img>

<img src="./imagens/pergunta1.png" width="1000" height="450"></img>

<img src="./imagens/pergunta2.png" width="850" height="550"></img>

Registo de Ferramentas Utilizadas
---

- **ChatGPT** – Apoio na clarificação de requisitos, organização do documento.
- **Google Docs** – Escrita colaborativa e revisão do documento inicial entre os membros do grupo.
- **Visual Studio Code** – Edição do ficheiro em Markdown com melhor formatação e 
pré-visualização.
- **GitHub** - Utilizado para organização do repositório do projeto e do ficheiro da fase 1 e colaboração entre os membros da equipa.
- **Discord** – Comunicação entre os membros do grupo durante esta fase do projeto.