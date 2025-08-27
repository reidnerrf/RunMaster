## Modelo de Dados e Esquema de Armazenamento

Objetivo: definir entidades, relacionamentos e camadas de armazenamento (local/remote) com estratégia offline-first e versionamento de schema.

### Princípios
- Offline-first com fila de mutations e replicação eventual
- Identificadores estáveis (UUID v4) e `updated_at`/`version` para resolução de conflitos
- Separação entre dados de domínio, telemetria e cache derivado

### Entidades Núcleo
- User { id, account_status, consent_analytics, consent_health, created_at }
- Profile { id, user_id, name, goals, is_active, created_at, updated_at }
- Preference { id, user_id, profile_id?, key, value, updated_at }
- Route { id, user_id, name, polyline, elevation_gain_m, surface, created_at }
- Workout { id, user_id, type, start_ts, end_ts, distance_m, duration_s, source, route_id?, avg_hr?, calories?, created_at, updated_at }
- Challenge { id, owner_user_id, type, rules, start_ts, end_ts, status }
- ChallengeParticipant { id, challenge_id, user_id, joined_at, progress }
- Achievement { id, key, name, description, rules }
- AchievementProgress { id, user_id, achievement_id, progress, unlocked_at? }
- Message { id, channel_id, sender_user_id, content, attachments?, created_at }
- Group { id, name, owner_user_id, description?, created_at }
- Event { id, group_id?, title, start_ts, end_ts, location, route_id?, created_at }
- Follow { id, follower_user_id, target_user_id, created_at }
- HealthSample { id, user_id, source, type, value, unit, start_ts, end_ts, device?, created_at }
- SleepSession { id, user_id, provider, start_ts, end_ts, quality_score?, stages?, created_at }
- MLModelMeta { id, name, version, checksum, size_kb, created_at }
- MLSuggestion { id, user_id, type, payload, score, created_at, consumed_at? }

### Relacionamentos (chaves principais)
- User 1—N Profile, Preference, Workout, Route, Follow (como follower), HealthSample, SleepSession, MLSuggestion
- Group 1—N Message; Group N—N User (membership implícita via channel/membership)
- Challenge 1—N ChallengeParticipant; User N—N Challenge via Participant

### Armazenamento
- Local: AsyncStorage (KV leve: preferências, histórico de navegação), SQLite/WatermelonDB/MMKV (dados estruturados e filas)
- Remoto: Backend (ex.: Convex/Firestore/REST) com endpoints versionados

### Sincronização
- Filas: `outbox_mutations` com { opId, entity, op (create|update|delete), payload, ts }
- Resolução: last-write-wins com `version` + merge semântico para coleções (ex.: progressos)
- Ancoragem incremental para Health (tokens) e paginação por `updated_at`

### Índices (exemplos)
- Workout: (user_id, start_ts DESC), (user_id, route_id)
- Message: (channel_id, created_at DESC)
- HealthSample: (user_id, type, start_ts DESC)
- SleepSession: (user_id, start_ts DESC)

### Versionamento de Schema
- `schema_version` global e migrações incrementais
- Migrações idempotentes com rollback e testes E2E de migração

### Retenção e Privacidade
- Políticas por entidade (ex.: telemetria 13 meses; health por consentimento)
- Função de anonimização/exportação (portabilidade de dados)

### DTOs e Validação
- Zod/TypeScript para validação de payloads e contratos

### Observabilidade
- Medir latência de sync, tamanho de fila, taxa de conflitos

