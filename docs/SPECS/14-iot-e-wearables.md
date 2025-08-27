## 14. IoT e Wearables

### Objetivo
Integrar dados de dispositivos (relógios e monitores de sono) e oferecer companion apps.

### Escopo
- Companion App: Apple Watch / Wear OS (iniciar/pausar treino, métricas em tempo real)
- HealthKit / Google Fit: sincronização de passos, HR, distâncias, sono
- Monitores de sono: importação, qualidade do sono, correlação com performance

### Arquitetura
- Camada `HealthDataBridge`: abstrai HealthKit / Google Fit com mapeamento unificado
- `WatchCompanion`: comunicação (WCSession/MessageClient) e store compartilhado
- `SleepIngestion`: conectores por fornecedor (SDKs) e formato normalizado

### Permissões e Privacidade
- Solicitar escopos mínimos necessários por categoria
- Painel para revogar/atualizar consentimentos; logs de acesso

### Sincronização
- Estratégia incremental (anchor/changes tokens)
- Resolução de duplicidades por `sourceId` e `timestamp` com tolerância

### Métricas
- Sucesso de pareamento, latência de sync, cobertura de dados por usuário

### Critérios de Aceite
- Companion registra treino e sincroniza com o app principal sem perdas
- Dados de sono aparecem em timeline e alimentam recomendações

