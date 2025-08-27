## 9. Machine Learning e IA

### Objetivo
Entregar personalização e predições no dispositivo, preservando privacidade e performance.

### Escopo
- Modelos locais (inferência on-device) com fallback server-side opcional
- Personalização contínua (aprendizado leve incremental)
- Predições: sugestões de treino, horários e rotas

### Stack Sugerida
- `onnxruntime-react-native` para inferência multiplataforma
- Feature store local (AsyncStorage/SQLite) para agregados
- Agendador em background (BG tasks) para atualização de features

### Pipeline de Features (exemplos)
- Frequência e duração de treinos, horário preferido, terreno comum
- Sinais de fadiga (sono, HRV quando disponível), clima

### Privacidade
- Opt-in explícito; processamento local; upload anon/anônimo só com consentimento

### Métricas
- Top-K acurácia de sugestão, CTR das sugestões, tempo até iniciar treino

### Critérios de Aceite
- Inferência p95 < 50ms em mid-tier devices
- Queda graciosa quando modelo ausente/desatualizado

