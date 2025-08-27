## 10. Gamificação Avançada

### Objetivo
Aumentar engajamento via conquistas, desafios, níveis e recompensas.

### Escopo
- Conquistas: regras declarativas e progressos
- Desafios: individuais e em grupo, assíncronos e em tempo quase real
- Níveis: XP baseado em atividades válidas
- Social: compartilhamento nativo (Share/Deep Link)
- Recompensas: integração parceira (cupom/benefícios)

### Arquitetura
- Motor de regras com eventos de domínio ("run_completed", "streak_day")
- Antifraude básica (detecção de outliers, GPS spoofing heurístico)
- Feature flags para rollouts graduais

### Métricas
- Conclusão de desafios, DAU de telas de gamificação, resgate de recompensas

### Critérios de Aceite
- Regras atualizáveis sem release (remotas) quando possível
- Persistência e recuperação correta de progresso offline

