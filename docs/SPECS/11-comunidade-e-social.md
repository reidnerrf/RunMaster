## 11. Comunidade e Social

### Objetivo
Criar laços entre corredores com chat, grupos, eventos e feed personalizado.

### Escopo
- Chat em tempo real (1:1 e grupos)
- Grupos de treino e eventos locais
- Sistema de seguimento (follow/unfollow)
- Feed com recomendações e moderação básica

### Arquitetura
- Canal de tempo real (WebSocket/Convex/Firestore)
- Paginação e limites para evitar overfetch
- Moderação: denúncias, silenciamento, bloqueio

### Privacidade
- Contas públicas/privadas, controle de descoberta, gestão de consentimentos

### Métricas
- Mensagens ativas/dia, criação de grupos, participação em eventos, engajamento do feed

### Critérios de Aceite
- Entrega em rede instável com retry e indicadores de envio
- Modo silencioso e controles de notificações por thread

