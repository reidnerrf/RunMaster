## Roadmap de Implementação

Este roadmap organiza a entrega das features 6, 9–12, 14–16 em fases com dependências, critérios de aceite e métricas de sucesso.

### Princípios
- Offline-first, privacidade por padrão, telemetria mínima necessária
- Entregas iterativas com feature flags e A/B testing quando aplicável
- Portabilidade: Android e iOS, preparação para companion em relógios

### Fase 1 (Sprints 1–3)
- Navegação inteligente (deep linking, histórico, persistência, sync básica)
- Fundamentos de analytics (eventos base, KPIs de navegação e engajamento)
- Gamificação básica (sistema de conquistas inicial)
- Infra de ML on-device (pipeline, inferência local com modelo placeholder)

Critérios de aceite
- Links `app://` abrem rotas específicas com estado mínimo restaurado
- Sugestões de navegação baseadas em recência/frequência aparecem sem travamentos
- Cache com AsyncStorage e fallback offline ok; sincroniza ao voltar conexão
- 5+ eventos base registrados no provedor de analytics

### Fase 2 (Sprints 4–6)
- Gamificação avançada (níveis, progressão, desafios assíncronos)
- Personalização (perfis múltiplos, preferências granulares, automações)
- Social (feed básico, follow/unfollow, grupos)

Critérios de aceite
- Engine de regras de preferências e automações com auditoria
- Feed e follow com paginação e moderação mínima
- Desafios com validação anti-fraude básica

### Fase 3 (Sprints 7–9)
- Assistentes de voz (Siri/Google Assistant intents essenciais)
- Wearables (companion app esqueleto, sincronização de métricas chave)
- Integrações HealthKit/Google Fit (sincronização unidirecional, opt-in)

Critérios de aceite
- Intents de voz para iniciar/encerrar treino e consultar métricas
- Sincronização de passos/frequência cardíaca/distância com consentimento
- Controles de privacidade e revogação de consentimento

### Fase 4 (Sprints 10–12)
- IoT: monitores de sono (importação e correlação com performance)
- Análises avançadas (predição de lesões, otimização de performance, terreno, clima)
- Dashboards e relatórios (comparações, tendências, metas inteligentes)

Critérios de aceite
- Modelos com métricas validadas offline e guardrails de explicabilidade
- Dashboards com filtros, exportação de dados e metas sugeridas

### Dependências e Riscos
- Políticas de loja (HealthKit/Google Fit, background activity)
- LGPD/GDPR: consentimento, direito ao esquecimento, minimização de dados
- Performance em devices de entrada: restrições para modelos locais

### Métricas de Sucesso (macro)
- Tempo até valor: deep link → ação em < 3s (p95)
- Retenção D30, DAU/WAU, sessões por usuário
- Taxa de conclusão de desafios; engajamento em social
- Acurácia de predições vs baseline e taxa de adoção das sugestões

### Links
- Specs detalhadas em `docs/SPECS/`
- Funcionalidades diferenciais: `FUNCIONALIDADES_DIFERENCIAIS.md`

