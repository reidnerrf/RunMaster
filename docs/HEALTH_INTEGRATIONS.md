## Integrações HealthKit (iOS) e Google Fit (Android)

### Objetivo
Unificar sincronização de dados de saúde (passos, HR, distância, sono, treinos) com consentimento explícito, minimizando duplicidades e assegurando privacidade.

### Bridge e Mapeamento
- Camada `HealthDataBridge` padroniza formatos:
  - Steps → { type: steps, value: number, unit: count }
  - Distance → { type: distance, value: meters, unit: m }
  - HeartRate → { type: heartRate, value: bpm, unit: bpm }
  - ActiveEnergy → { type: calories, value: kcal, unit: kcal }
  - Sleep → { type: sleep, value: duration_min, unit: min, stages? }
  - Workout (running) → { type: workout, distance_m, duration_s, avg_hr?, calories }

### HealthKit (iOS)
- Leitura: HKQuantityTypeIdentifierStepCount, DistanceWalkingRunning, HeartRate, ActiveEnergyBurned, SleepAnalysis, Workouts
- Escrita: StepCount, ActiveEnergyBurned, Workouts (opcional)
- Tokens de âncora para incremental; deduplicar por (UUID, startDate)

### Google Fit (Android)
- Leitura: DataTypes.STEP_COUNT_DELTA, DISTANCE_DELTA, HEART_RATE_BPM, CALORIES_EXPENDED, SLEEP_SEGMENT, SESSIONS (workout)
- Escrita: equivalente quando permitido
- Paginação por timeRange e sessão; deduplicar por (dataSourceId, startTimeNanos)

### Estratégia de Sync
- Opt-in por categoria; painel de consentimentos e revogação
- Incremental (últimas 24h/7d/30d conforme tipo); full sync sob demanda
- Normalização de unidades; conversão para SI
- Conflitos: preferir fontes com melhor precisão (device > app > manual)

### Privacidade
- Solicitar escopos mínimos; logs de acesso; exportação/remoção de dados por usuário
- Processamento local; envio ao backend apenas com consentimento

### Telemetria
- `health_sync_request` { source, categories }
- `health_sync_result` { source, success, items, failed }
- `sleep_imported` { provider, duration_min, quality_score }

### Critérios de Aceite
- Sincronização consistente em rede instável e reconciliação sem duplicidade
- Respeito total às permissões do usuário e ability de revogação

