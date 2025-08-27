## 12. Personalização Extrema

### Objetivo
Dar controle total ao usuário com perfis, preferências granulares, automações, calendário e lembretes inteligentes.

### Escopo
- Perfis múltiplos (ex.: "Perder peso", "Performance 10K") com metas distintas
- Preferências granulares (notificações, privacidade, conteúdo)
- Automações baseadas em regras (se/então) com gatilhos e ações
- Integração de calendário (sincronizar treinos e eventos)
- Lembretes inteligentes (contextuais por horário, localização e condições)

### Arquitetura
- `UserProfilesService`: CRUD de perfis e metas ativas
- `PreferencesStore`: chave-valor tipado com escopo por perfil
- `RulesEngine`: DSL simples para gatilhos (tempo, local, eventos) → ações
- `CalendarGateway`: iOS EventKit / Android Calendar Provider
- `ReminderOrchestrator`: agenda jobs (BG tasks) e notifica

### Requisitos Funcionais
- Alternar perfil ativo sem reinstalar; migração de preferências por perfil
- Regras de automação habilitar/desabilitar com histórico de execuções
- Inserir/atualizar treinos no calendário com consentimento e bi-direcional opcional

### Não Funcionais
- Conflitos de agendamento resolvidos com política configurável (prioridade)
- Consumo de bateria mínimo; limites para geofencing e BG tasks

### Telemetria
- `profile_switch`, `automation_fired`, `calendar_sync`, `smart_reminder_shown`

### Critérios de Aceite
- Troca de perfil em < 300ms e preferências isoladas por perfil
- Lembretes com taxa de abertura > baseline e sem duplicidade

