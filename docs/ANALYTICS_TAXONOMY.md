## Analytics: Taxonomia de Eventos, Propriedades e KPIs

Objetivo: padronizar instrumentação para medir uso, qualidade e impacto das features 6, 9–12, 14–16, preservando privacidade e possibilitando comparações consistentes.

### Convenções
- snake_case para nomes de eventos e propriedades
- `event_version` inteiro, incrementado quando o payload muda
- Não enviar PII no payload. IDs internos ou hashes irreversíveis quando necessário
- Timestamp sempre em UTC ISO-8601

### Envelope comum (adicionado automaticamente)
- `event_name`, `event_version`, `timestamp`
- `user_id` (ou anon_id), `session_id`, `device_id`
- `app_version`, `build_number`, `platform` (ios|android), `os_version`
- `locale`, `country`, `network_type`, `device_tier`

### Propriedades de usuário (user properties)
- `account_status` (anon|registered|pro)
- `profile_active` (string)
- `consent_analytics` (bool), `consent_health` (bool)
- `onboarding_stage` (string)

### Eventos base (app lifecycle e navegação)
- `session_start` v1 { source }
- `screen_view` v1 { screen_name, referrer }
- `deeplink_open` v1 { url, route, source (push|external|internal), params_redacted_hash }
- `action_performed` v1 { action_name, context }
- `error_shown` v1 { code, area, fatal (bool) }

### Navegação Inteligente (06)
- `nav_suggestion_shown` v1 { surface, suggestions: [key] }
- `nav_suggestion_click` v1 { surface, key }
- `offline_queue_enqueued` v1 { op, resource }
- `offline_queue_flushed` v1 { total, success, failed }

### ML e IA (09)
- `ml_model_loaded` v1 { model_name, model_version, size_kb }
- `ml_inference` v1 { model_name, latency_ms, success (bool) }
- `ml_suggestion_shown` v1 { type, score }
- `ml_suggestion_accepted` v1 { type }

### Gamificação (10)
- `achievement_unlocked` v1 { achievement_id }
- `challenge_joined` v1 { challenge_id, type }
- `challenge_completed` v1 { challenge_id, result }
- `xp_gained` v1 { amount, reason }
- `level_up` v1 { level }
- `reward_redeemed` v1 { reward_id, partner }

### Comunidade e Social (11)
- `message_sent` v1 { channel_id, type (direct|group) }
- `message_received` v1 { channel_id, type }
- `group_created` v1 { group_id }
- `event_joined` v1 { event_id }
- `follow` v1 { target_user_id }
- `unfollow` v1 { target_user_id }
- `feed_item_view` v1 { item_id, item_type }
- `feed_item_engage` v1 { item_id, action (like|comment|share) }

### Personalização Extrema (12)
- `profile_switch` v1 { profile }
- `preferences_changed` v1 { scope, keys: [k] }
- `automation_fired` v1 { rule_id, trigger }
- `calendar_sync` v1 { direction (write|read), items }
- `smart_reminder_shown` v1 { reason }

### IoT e Wearables (14)
- `watch_paired` v1 { platform (watchos|wearos) }
- `watch_sync` v1 { items }
- `health_sync_request` v1 { source (healthkit|google_fit), categories: [k] }
- `health_sync_result` v1 { source, success, items, failed }
- `sleep_imported` v1 { provider, duration_min, quality_score }

### Treinos (cross-feature)
- `run_started` v1 { mode (indoor|outdoor) }
- `run_paused` v1 {}
- `run_resumed` v1 {}
- `run_completed` v1 { distance_km, duration_s, avg_hr, calories }

### Privacidade e consentimento
- `consent_updated` v1 { scope, value }

### KPIs e métricas derivadas
- Retenção D1/D7/D30: coortes por `session_start`
- Adoção de deep link: taxa `deeplink_open` → `action_performed`
- CTR de sugestões: `*_suggestion_shown` → `*_suggestion_accepted`
- Sucesso offline: razão `offline_queue_flushed.success/total`
- Gamificação: `challenge_joined`→`challenge_completed`, `achievement_unlocked` por DAU
- Social: mensagens/dia por usuário, `feed_item_view`→`feed_item_engage`
- Health/Wearables: taxa de sucesso `health_sync_result`, `watch_paired`
- ML: p95 `ml_inference.latency_ms`, taxa de aceitação de sugestões
- Qualidade: crash-free sessions (ausência de `error_shown.fatal` e logs de crash)

### Amostragem e limites
- Amostragem padrão 100%; reduzir para 10% em `screen_view` em picos (config remoto)
- Redigir payloads para < 2KB; truncar listas longas

### Versionamento e migração
- Incluir `event_version` e manter compatibilidade por 2 versões
- Documentar breaking changes neste arquivo

### Implementação
- Criar um `AnalyticsClient` com fila e retry; plugin para provedor (ex.: Segment, Amplitude)
- Garantir envio em background e flushing no `app_state: background`

### Anexos
- Dicionário de telas (`screen_name`) e superfícies de sugestão (`surface`) a manter em `docs/SCREEN_DICTIONARY.md`

