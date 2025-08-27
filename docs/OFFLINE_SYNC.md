## Offline-first: Sincronização e Resolução de Conflitos

### Objetivos
- Garantir uso contínuo sem rede e sincronização previsível quando reconectar
- Minimizar perdas e duplicidades, com replays idempotentes

### Componentes
- Outbox de mutations (local): `outbox_mutations` com { opId, entity, op, payload, ts }
- Fila de envio: backoff exponencial, deduplicação por `opId`, ordenação por `ts`
- Anchor tokens/incremental sync (pull) por entidade: parâmetro `since`/`updated_at`
- Detector de conectividade: NetInfo

### Regras de Enfileiramento
- Apenas mutations (POST/PUT/PATCH/DELETE) entram na outbox; GET é servida de cache
- Agrupar/colapsar operações redundantes (ex.: update→update)
- Tentar enviar imediatamente se online; caso contrário persistir e agendar

### Política de Conflitos
- Base: last-write-wins por `version`/`updated_at`
- Mescla semântica quando aplicável (ex.: progresso de conquistas soma cumulativa)
- Deletes levam precedência se mais novos que creates/updates

### Idempotência
- Header `Idempotency-Key: opId` em todas as mutations
- Servidor deve ignorar duplicatas e retornar o mesmo resultado

### Consistência Visual
- Optimistic UI: aplicar mutation local e marcar como `pending`
- Reverter/ajustar estado em caso de erro definitivo do servidor

### Retentativas e Backoff
- Exponencial com jitter (ex.: 1s, 2s, 4s, 8s, máx 60s)
- Stop conditions: HTTP 4xx definitivos (ex.: 403, 404 com recurso inexistente), política por código

### Segurança e Privacidade
- Criptografar storage quando disponível (MMKV/Keychain/Keystore para tokens sensíveis)
- Minimização de payload; evitar dados de saúde sem consentimento

### Telemetria (ver ANALYTICS_TAXONOMY)
- `offline_queue_enqueued`, `offline_queue_flushed` { total, success, failed }
- Latência média de flush e tamanho médio da fila

### Integração com Health/Watch
- Sync incremental por categoria com tokens (ex.: HealthKit/Google Fit)
- Deduplicar por `sourceId + timestamp`

### Endpoints (exemplo)
- POST /api/mutations { id: opId, entity, op, payload, client_ts }
- GET /api/sync?entity=workout&since=timestamp

### Testes
- E2E em modo avião: criar/editar/excluir, reconectar e validar estado final
- Teste de conflitos: updates paralelos → verificar política aplicada

