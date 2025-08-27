## Assistentes de Voz: Siri / Google Assistant

### Objetivo
Oferecer comandos rápidos: iniciar/encerrar treino, consultar métricas e próximos eventos.

### Intents (MVP)
- StartRunIntent: iniciar corrida
- StopRunIntent: encerrar corrida atual
- QueryLastRunIntent: métricas da última corrida
- QueryNextEventIntent: próximo evento de grupo

### iOS (Siri)
- SiriKit Intents + App Intents (iOS 16+)
- Atalhos sugeridos com doações de intents (INInteraction)

### Android (Assistant)
- App Actions (shortcuts.xml / capabilities) e BII compatíveis

### Segurança
- Requer sessão autenticada; respostas sem dados sensíveis por padrão

