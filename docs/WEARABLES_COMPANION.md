## Companion App: Apple Watch / Wear OS

### Objetivo
Permitir iniciar/pausar treinos, exibir métricas em tempo real e sincronizar com o app principal.

### Escopo (MVP)
- Tela de treino: pace, distância, duração, FC (quando disponível)
- Controles: iniciar, pausar, retomar, encerrar
- Sincronização: envio de eventos e amostras a cada N segundos

### Arquitetura
- iOS: WatchConnectivity (WCSession), background transfers
- Android: Wearable Data Layer (MessageClient/DataClient)
- Store compartilhada mínima (id de sessão, estado do treino)

### Eventos
- `watch_paired`, `watch_sync`, `run_started`, `run_completed`

### Critérios de Aceite
- Controle do treino pelo relógio com latência aceitável (< 500ms)
- Reconexão automática após perda de link

