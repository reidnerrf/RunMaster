## Dashboards e Relatórios

### Objetivo
Entregar visualizações úteis para usuários (progresso) e para o time (saúde do produto).

### Dashboards do Usuário
- Progresso semanal/mensal (distância, tempo, pace)
- Comparações (benchmark por faixa etária/nivel anônimo)
- Tendências e metas sugeridas

### Dashboards Internos
- Funis (onboarding, desafios, social)
- Retenção, coortes, adoção de funcionalidades

### Relatórios
- Exportação CSV/JSON, filtros por período e entidade

### Requisitos
- Offline→online: cache local e atualização incremental
- Performance: p95 < 200ms para agregações locais; remotas com loading states

