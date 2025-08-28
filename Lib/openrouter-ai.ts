// Serviço de IA usando OpenRouter API
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';
import LZString from 'lz-string';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: OpenRouterMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIConversation {
  id: string;
  messages: OpenRouterMessage[];
  context: {
    userProfile: any;
    runningHistory: any[];
    currentGoals: any[];
    weatherConditions?: any;
    location?: { lat: number; lon: number };
  };
  createdAt: Date;
  updatedAt: Date;
}

class OpenRouterAIService {
  private apiKey: string | null = null;
  private baseUrl: string = 'https://openrouter.ai/api/v1';
  private conversations: Map<string, AIConversation> = new Map();
  private defaultModel: string = 'z-ai/glm-4.5-air:free';
  private defaultTTLMs: number = 6 * 60 * 60 * 1000; // 6 horas
  private inflightRequests: Map<string, Promise<string>> = new Map();
  private cache: Map<string, { compressed: string; timestamp: number; ttl: number }> = new Map();
  private readonly storageKey = 'ai_chat_cache_v1';

  constructor() {
    // Inicializar o serviço
    console.log('OpenRouter AI Service initialized');
    // Carrega cache de forma assíncrona (best-effort)
    this.loadCache();
  }

  // Chat básico com a IA
  async chat(messages: OpenRouterMessage[], model?: string): Promise<string> {
    try {
      const request: OpenRouterRequest = {
        model: model || this.defaultModel,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      };

      const apiKey = await this.getApiKey();
      const cacheKey = await this.buildCacheKey(request);

      // Retorna do cache se válido
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      // De-duplicação de requisições em voo
      const existing = this.inflightRequests.get(cacheKey);
      if (existing) {
        return existing;
      }

      const fetchOnce = async (): Promise<string> => {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip',
            'HTTP-Referer': 'https://runtracker.app',
            'X-Title': 'RunTracker AI Assistant'
          },
          body: JSON.stringify(request)
        });

        if (!response.ok) {
          throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
        }

        const data: OpenRouterResponse = await response.json();
        const content = data.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';
        this.saveToCache(cacheKey, content, this.defaultTTLMs);
        return content;
      };

      const fetchWithRetry = async (retries = 2, baseDelayMs = 200): Promise<string> => {
        let attempt = 0;
        while (true) {
          try {
            return await fetchOnce();
          } catch (err) {
            attempt++;
            if (attempt > retries) throw err;
            const delay = baseDelayMs * Math.pow(2, attempt - 1);
            await new Promise(res => setTimeout(res, delay));
          }
        }
      };

      const fetchPromise = fetchWithRetry();

      this.inflightRequests.set(cacheKey, fetchPromise);
      try {
        const result = await fetchPromise;
        return result;
      } finally {
        this.inflightRequests.delete(cacheKey);
      }
    } catch (error) {
      console.error('Erro na comunicação com OpenRouter:', error);
      throw error;
    }
  }

  // Carrega API Key de forma segura via expo extra/env
  private async getApiKey(): Promise<string> {
    if (this.apiKey) return this.apiKey;
    const extraKey = (Constants?.expoConfig as any)?.extra?.openrouterApiKey as string | undefined;
    const envKey = (typeof process !== 'undefined' ? (process as any).env?.EXPO_PUBLIC_OPENROUTER_API_KEY : undefined) as string | undefined;
    const key = (extraKey && extraKey.trim()) || (envKey && envKey.trim()) || '';
    if (!key) {
      console.warn('OpenRouter API key não configurada. Defina em app.json extra.openrouterApiKey ou EXPO_PUBLIC_OPENROUTER_API_KEY.');
    }
    this.apiKey = key;
    return this.apiKey;
  }

  // Cache helpers
  private async loadCache(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, { compressed: string; timestamp: number; ttl: number }>;
      this.cache = new Map(Object.entries(parsed));
    } catch (e) {
      console.warn('Falha ao carregar cache de IA:', e);
      this.cache = new Map();
    }
  }

  private async persistCache(): Promise<void> {
    try {
      const obj = Object.fromEntries(this.cache);
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(obj));
    } catch (e) {
      console.warn('Falha ao salvar cache de IA:', e);
    }
  }

  private getFromCache(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      // Persist best-effort sem aguardar
      this.persistCache();
      return null;
    }
    try {
      const decompressed = LZString.decompressFromUTF16(entry.compressed) || '';
      return decompressed || null;
    } catch {
      return null;
    }
  }

  private async buildCacheKey(request: OpenRouterRequest): Promise<string> {
    const payload = JSON.stringify({ model: request.model, messages: request.messages });
    try {
      // Hash estável para chave curta
      const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, payload);
      return `chat:${hash}`;
    } catch {
      return `chat:${payload}`;
    }
  }

  private saveToCache(key: string, value: string, ttl: number): void {
    try {
      const compressed = LZString.compressToUTF16(value);
      this.cache.set(key, { compressed, timestamp: Date.now(), ttl });
      // Persistência best-effort
      this.persistCache();
    } catch (e) {
      console.warn('Falha ao comprimir/salvar resposta de IA:', e);
    }
  }

  // Análise de performance avançada
  async analyzePerformance(runningHistory: any[], userProfile: any): Promise<any> {
    const systemPrompt = `Você é um coach de corrida especialista em análise de performance. 
    Analise os dados fornecidos e forneça insights detalhados sobre:
    1. Análise de tendências de performance
    2. Identificação de pontos fortes e áreas de melhoria
    3. Estimativa de VO2 max e limiar de lactato
    4. Recomendações personalizadas de treino
    5. Previsões de tempo para diferentes distâncias
    
    Responda em português brasileiro de forma clara e motivacional.`;

    const userPrompt = `Analise minha performance de corrida:
    
    Perfil do usuário: ${JSON.stringify(userProfile, null, 2)}
    
    Histórico de corridas (últimas 10):
    ${JSON.stringify(runningHistory.slice(-10), null, 2)}
    
    Forneça uma análise completa e recomendações específicas.`;

    try {
      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      return {
        analysis: response,
        timestamp: new Date(),
        confidence: 0.95
      };
    } catch (error) {
      console.error('Erro na análise de performance:', error);
      return this.getFallbackPerformanceAnalysis(runningHistory, userProfile);
    }
  }

  // Sugestões de rota inteligentes
  async suggestRoutes(context: {
    location: { lat: number; lon: number };
    distance_preference_km: number;
    difficulty: 'easy' | 'moderate' | 'hard';
    weather_conditions?: any;
    time_of_day?: string;
    user_preferences?: any;
  }): Promise<any> {
    const systemPrompt = `Você é um especialista em rotas de corrida que conhece bem a cidade de São Paulo.
    Sugira rotas personalizadas baseadas no contexto fornecido.
    
    Considere:
    - Segurança da rota (iluminação, tráfego, crime)
    - Qualidade da superfície (asfalto, terra, paralelepípedo)
    - Elevação e desafios
    - Pontos de interesse e paisagens
    - Acessibilidade e facilidade de navegação
    
    Responda com rotas específicas, incluindo nomes de ruas, parques ou bairros conhecidos.`;

    const userPrompt = `Sugira rotas de corrida para mim:
    
    Localização: ${context.location.lat}, ${context.location.lon}
    Distância preferida: ${context.distance_preference_km}km
    Dificuldade: ${context.difficulty}
    Clima: ${JSON.stringify(context.weather_conditions)}
    Horário: ${context.time_of_day}
    Preferências: ${JSON.stringify(context.user_preferences)}
    
    Forneça 3-5 opções de rota com detalhes específicos.`;

    try {
      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      return {
        routes: this.parseRouteSuggestions(response),
        aiReasoning: response,
        timestamp: new Date(),
        confidence: 0.88
      };
    } catch (error) {
      console.error('Erro nas sugestões de rota:', error);
      return this.getFallbackRouteSuggestions(context);
    }
  }

  // Plano de treino personalizado
  async generateWorkoutPlan(goal: {
    type: '5k' | '10k' | 'half_marathon' | 'marathon' | 'fitness' | 'weight_loss';
    target_date?: string;
    current_fitness: 'beginner' | 'intermediate' | 'advanced';
    available_days_per_week: number;
    preferred_duration_minutes: number;
    recent_performance?: any;
  }): Promise<any> {
    const systemPrompt = `Você é um treinador de corrida certificado com experiência em preparação para diferentes distâncias.
    Crie um plano de treino personalizado e detalhado.
    
    Inclua:
    - Treinos específicos para cada dia
    - Progressão gradual de intensidade
    - Treinos de velocidade, resistência e recuperação
    - Dicas de pacing e frequência cardíaca
    - Adaptações baseadas no nível de fitness
    - Estratégias de recuperação e prevenção de lesões
    
    Responda com um plano estruturado e motivacional.`;

    const userPrompt = `Crie um plano de treino para mim:
    
    Meta: ${goal.type}
    Data alvo: ${goal.target_date || 'Não definida'}
    Nível atual: ${goal.current_fitness}
    Dias disponíveis por semana: ${goal.available_days_per_week}
    Duração preferida: ${goal.preferred_duration_minutes} minutos
    Performance recente: ${JSON.stringify(goal.recent_performance)}
    
    Forneça um plano completo de 4-8 semanas.`;

    try {
      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      return {
        plan: this.parseWorkoutPlan(response),
        aiReasoning: response,
        timestamp: new Date(),
        confidence: 0.92
      };
    } catch (error) {
      console.error('Erro na geração do plano:', error);
      return this.getFallbackWorkoutPlan(goal);
    }
  }

  // Conselhos nutricionais personalizados
  async getNutritionAdvice(context: {
    workout_intensity: 'low' | 'moderate' | 'high';
    duration_minutes: number;
    time_of_day: string;
    weather_conditions?: any;
    user_dietary_restrictions?: string[];
    fitness_goals?: string[];
  }): Promise<any> {
    const systemPrompt = `Você é um nutricionista esportivo especializado em corrida.
    Forneça conselhos nutricionais específicos e práticos.
    
    Considere:
    - Timing da nutrição (pré, durante e pós treino)
    - Hidratação baseada na intensidade e clima
    - Alimentos específicos para diferentes tipos de treino
    - Restrições dietéticas do usuário
    - Objetivos de fitness (performance, perda de peso, etc.)
    
    Responda com recomendações práticas e alimentos específicos.`;

    const userPrompt = `Me dê conselhos nutricionais para minha corrida:
    
    Intensidade: ${context.workout_intensity}
    Duração: ${context.duration_minutes} minutos
    Horário: ${context.time_of_day}
    Clima: ${JSON.stringify(context.weather_conditions)}
    Restrições: ${context.user_dietary_restrictions?.join(', ') || 'Nenhuma'}
    Objetivos: ${context.fitness_goals?.join(', ') || 'Performance geral'}
    
    Forneça um plano nutricional completo.`;

    try {
      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      return {
        nutrition: this.parseNutritionAdvice(response),
        aiReasoning: response,
        timestamp: new Date(),
        confidence: 0.90
      };
    } catch (error) {
      console.error('Erro no conselho nutricional:', error);
      return this.getFallbackNutritionAdvice(context);
    }
  }

  // Análise de risco de lesão
  async assessInjuryRisk(context: {
    recent_workouts: any[];
    current_symptoms?: string[];
    training_load: number;
    recovery_patterns?: any;
    injury_history?: string[];
  }): Promise<any> {
    const systemPrompt = `Você é um fisioterapeuta esportivo especializado em prevenção de lesões em corredores.
    Avalie o risco de lesão e forneça recomendações preventivas.
    
    Considere:
    - Padrões de treino e recuperação
    - Sintomas atuais e histórico de lesões
    - Carga de treino e progressão
    - Sinais de overtraining
    - Estratégias de prevenção específicas
    
    Responda com uma avaliação de risco e plano preventivo.`;

    const userPrompt = `Avalie meu risco de lesão:
    
    Treinos recentes: ${JSON.stringify(context.recent_workouts)}
    Sintomas atuais: ${context.current_symptoms?.join(', ') || 'Nenhum'}
    Carga de treino: ${context.training_load}/10
    Padrões de recuperação: ${JSON.stringify(context.recovery_patterns)}
    Histórico de lesões: ${context.injury_history?.join(', ') || 'Nenhuma'}
    
    Forneça uma avaliação completa de risco.`;

    try {
      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      return {
        riskAssessment: this.parseInjuryRisk(response),
        aiReasoning: response,
        timestamp: new Date(),
        confidence: 0.87
      };
    } catch (error) {
      console.error('Erro na avaliação de risco:', error);
      return this.getFallbackInjuryRisk(context);
    }
  }

  // Otimização climática
  async optimizeForWeather(context: {
    location: { lat: number; lon: number };
    planned_time: string;
    weather_forecast: any;
    user_preferences: any;
  }): Promise<any> {
    const systemPrompt = `Você é um especialista em otimização de treinos baseada em condições climáticas.
    Analise o clima e sugira ajustes para maximizar performance e segurança.
    
    Considere:
    - Temperatura, umidade e vento
    - Qualidade do ar e índice UV
    - Roupas e equipamentos recomendados
    - Ajustes de rota para condições climáticas
    - Horários alternativos mais favoráveis
    
    Responda com recomendações específicas e práticas.`;

    const userPrompt = `Otimize meu treino para as condições climáticas:
    
    Localização: ${context.location.lat}, ${context.location.lon}
    Horário planejado: ${context.planned_time}
    Previsão do tempo: ${JSON.stringify(context.weather_forecast)}
    Preferências: ${JSON.stringify(context.user_preferences)}
    
    Forneça otimizações específicas.`;

    try {
      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      return {
        optimization: this.parseWeatherOptimization(response),
        aiReasoning: response,
        timestamp: new Date(),
        confidence: 0.85
      };
    } catch (error) {
      console.error('Erro na otimização climática:', error);
      return this.getFallbackWeatherOptimization(context);
    }
  }

  // Conversa contínua com contexto
  async continueConversation(conversationId: string, userMessage: string): Promise<string> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversa não encontrada');
    }

    // Adicionar mensagem do usuário
    conversation.messages.push({ role: 'user', content: userMessage });
    conversation.updatedAt = new Date();

    try {
      const response = await this.chat(conversation.messages);
      
      // Adicionar resposta da IA
      conversation.messages.push({ role: 'assistant', content: response });
      conversation.updatedAt = new Date();

      return response;
    } catch (error) {
      console.error('Erro na continuação da conversa:', error);
      throw error;
    }
  }

  // Criar nova conversa
  createConversation(context: {
    userProfile: any;
    runningHistory: any[];
    currentGoals: any[];
    weatherConditions?: any;
    location?: { lat: number; lon: number };
  }): string {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const conversation: AIConversation = {
      id: conversationId,
      messages: [
        {
          role: 'system',
          content: `Você é um assistente de IA especializado em corrida e fitness. 
          Você tem acesso ao perfil do usuário e histórico de treinos.
          Seja motivacional, prático e específico em suas respostas.
          Use sempre português brasileiro.`
        }
      ],
      context,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.conversations.set(conversationId, conversation);
    return conversationId;
  }

  // Métodos auxiliares de parsing
  private parseRouteSuggestions(aiResponse: string): any[] {
    // Implementar parsing da resposta da IA para estruturar as rotas
    return [
      {
        id: 'ai-route-1',
        name: 'Rota IA Sugerida',
        distance_km: 5,
        difficulty: 'moderate',
        aiReasoning: aiResponse
      }
    ];
  }

  private parseWorkoutPlan(aiResponse: string): any {
    // Implementar parsing do plano de treino
    return {
      name: 'Plano IA Personalizado',
      description: aiResponse,
      workouts: []
    };
  }

  private parseNutritionAdvice(aiResponse: string): any {
    // Implementar parsing dos conselhos nutricionais
    return {
      pre_run: { foods: [], timing: '30 min antes' },
      during_run: { hydration: '100ml a cada 20 min' },
      post_run: { foods: [], timing: '30 min após' }
    };
  }

  private parseInjuryRisk(aiResponse: string): any {
    // Implementar parsing da avaliação de risco
    return {
      overall_risk: 'low',
      factors: [],
      recommendations: []
    };
  }

  private parseWeatherOptimization(aiResponse: string): any {
    // Implementar parsing da otimização climática
    return {
      optimal_times: [],
      route_adjustments: [],
      clothing_recommendations: []
    };
  }

  // Métodos de fallback
  private getFallbackPerformanceAnalysis(runningHistory: any[], userProfile: any): any {
    return {
      analysis: 'Análise de performance não disponível no momento.',
      timestamp: new Date(),
      confidence: 0.5
    };
  }

  private getFallbackRouteSuggestions(context: any): any {
    return {
      routes: [],
      aiReasoning: 'Sugestões de rota não disponíveis.',
      timestamp: new Date(),
      confidence: 0.5
    };
  }

  private getFallbackWorkoutPlan(goal: any): any {
    return {
      plan: { name: 'Plano Básico', description: 'Plano padrão não disponível.' },
      aiReasoning: 'Plano de treino não disponível.',
      timestamp: new Date(),
      confidence: 0.5
    };
  }

  private getFallbackNutritionAdvice(context: any): any {
    return {
      nutrition: { pre_run: {}, during_run: {}, post_run: {} },
      aiReasoning: 'Conselhos nutricionais não disponíveis.',
      timestamp: new Date(),
      confidence: 0.5
    };
  }

  private getFallbackInjuryRisk(context: any): any {
    return {
      riskAssessment: { overall_risk: 'unknown', factors: [], recommendations: [] },
      aiReasoning: 'Avaliação de risco não disponível.',
      timestamp: new Date(),
      confidence: 0.5
    };
  }

  private getFallbackWeatherOptimization(context: any): any {
    return {
      optimization: { optimal_times: [], route_adjustments: [], clothing_recommendations: [] },
      aiReasoning: 'Otimização climática não disponível.',
      timestamp: new Date(),
      confidence: 0.5
    };
  }

  // Gerenciamento de conversas
  getConversation(conversationId: string): AIConversation | undefined {
    return this.conversations.get(conversationId);
  }

  getAllConversations(): AIConversation[] {
    return Array.from(this.conversations.values());
  }

  deleteConversation(conversationId: string): boolean {
    return this.conversations.delete(conversationId);
  }

  // Estatísticas de uso
  getUsageStats(): any {
    const conversations = this.getAllConversations();
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);
    
    return {
      totalConversations: conversations.length,
      totalMessages,
      activeConversations: conversations.filter(conv => 
        Date.now() - conv.updatedAt.getTime() < 24 * 60 * 60 * 1000
      ).length,
      oldestConversation: conversations.length > 0 ? 
        Math.min(...conversations.map(conv => conv.createdAt.getTime())) : null
    };
  }
}

// Instância singleton do serviço
export const openRouterAI = new OpenRouterAIService();

// Funções de conveniência para uso direto
export const analyzePerformanceWithAI = (runningHistory: any[], userProfile: any) => 
  openRouterAI.analyzePerformance(runningHistory, userProfile);

export const suggestRoutesWithAI = (context: any) => 
  openRouterAI.suggestRoutes(context);

export const generateWorkoutPlanWithAI = (goal: any) => 
  openRouterAI.generateWorkoutPlan(goal);

export const getNutritionAdviceWithAI = (context: any) => 
  openRouterAI.getNutritionAdvice(context);

export const assessInjuryRiskWithAI = (context: any) => 
  openRouterAI.assessInjuryRisk(context);

export const optimizeForWeatherWithAI = (context: any) => 
  openRouterAI.optimizeForWeather(context);

export const chatWithAI = (messages: OpenRouterMessage[], model?: string) => 
  openRouterAI.chat(messages, model);