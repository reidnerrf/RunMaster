## 15. Análise Avançada

### Objetivo
Gerar insights acionáveis: predição de lesões, otimização de performance, terreno e clima.

### Módulos
- Predição de Lesões: risco semanal com base em carga aguda/crônica, variação, sono
- Otimização de Performance: recomendações de treino (intensidade/volume) e recuperação
- Análise de Terreno: classificação de rotas (altimetria, superfície) e esforço estimado
- Meteorologia: previsão e ajuste de plano conforme clima

### Dados de Entrada
- Histórico de treinos, métricas fisiológicas (HR/HRV), sono, clima, terreno

### Modelagem
- Modelos interpretabéis (GBDT/GLM) para risco; modelos seqüenciais para recomendações
- Guardrails: limites seguros, explicações (feature importance), thresholds conservadores

### Métricas
- AUC/PR para lesões, adesão às recomendações, melhoria de tempo/pace

### Critérios de Aceite
- Nenhuma recomendação violando limites de segurança configuráveis
- Insights reproduzíveis com logs de versão do modelo e features

