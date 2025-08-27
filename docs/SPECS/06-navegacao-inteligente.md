## 6. Navegação Inteligente

### Objetivo
Levar o usuário rapidamente à ação certa, com recuperação de contexto via deep linking, histórico inteligente e persistência local, funcionando offline-first.

### Escopo
- Deep Linking: `app://{rota}?params` e links universais/Android App Links
- Histórico Inteligente: sugestões baseadas em recência/frequência/horário
- Persistência: AsyncStorage para estado leve de UI e cache de dados
- Sincronização: replays de ações offline quando online, resolução básica de conflitos

### Arquitetura
- React Navigation `linking` config mapeando rotas ↔ links
- Handler de cold start e foreground para processar links
- Camada `NavigationInsights` coleta eventos de navegação (view, press, complete)
- Camada `LocalCache` (AsyncStorage) com TTLs e invalidadores por chave
- Camada `SyncQueue` (fila idempotente) com backoff exponencial e dedup

### Modelo de Dados (simplificado)
- `navigation_history:{userId}`: [{route, paramsHash, ts}]
- `suggestion_model_state:{userId}`: contadores de recência/frequência
- `offline_queue:{userId}`: ações serializadas (POST/PUT) com `opId`

### Requisitos Funcionais
- Abrir rotas por link profundo em app fechado/aberto
- Sugerir até 3 ações prováveis no topo das telas-chave
- Persistir últimos filtros e seleções por tela (opt-in)
- Enfileirar mutations offline e reaplicar ao reconectar

### Requisitos Não Funcionais
- p95 navegação < 150ms após hidratação; cold start deep link < 3s
- Zero crashes por link inválido; robustez a versões antigas de links

### Telemetria
- `nav_view`, `nav_deeplink_open`, `nav_suggestion_click`, `offline_queue_flush`

### Segurança e Privacidade
- Hash de parâmetros sensíveis antes de persistir
- Consentimento para histórico; opção de limpar dados e desativar sugestões

### Critérios de Aceite
- Testes E2E: abrir 5 rotas via deep link (fechado/aberto) com sucesso
- Sugestões melhoram tempo até ação em >10% vs controle

### Implementação (RN/Expo Router)
- Definir `scheme` e `deeplinks` no `app.json`
- Gravar histórico via hook de `useSegments()/usePathname()`
- Utilizar `@react-native-async-storage/async-storage`
- Detectar rede com `@react-native-community/netinfo`

