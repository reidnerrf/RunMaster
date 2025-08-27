import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Card, Button, Badge } from './index';
import { 
  Brain, 
  Send, 
  User, 
  Bot, 
  RefreshCw,
  Settings,
  MessageCircle
} from 'lucide-react-native';
import { 
  openRouterAI, 
  AIConversation, 
  OpenRouterMessage 
} from '../../Lib/openrouter-ai';
import { hapticSuccess, hapticWarning } from '../../utils/haptics';

type AIChatProps = {
  userProfile?: any;
  runningHistory?: any[];
  currentGoals?: any[];
  weatherConditions?: any;
  location?: { lat: number; lon: number };
  onClose?: () => void;
};

export default function AIChat({ 
  userProfile, 
  runningHistory, 
  currentGoals, 
  weatherConditions, 
  location, 
  onClose 
}: AIChatProps) {
  const { theme } = useTheme();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<OpenRouterMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<AIConversation | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initializeConversation();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const initializeConversation = async () => {
    try {
      const convId = openRouterAI.createConversation({
        userProfile: userProfile || {},
        runningHistory: runningHistory || [],
        currentGoals: currentGoals || [],
        weatherConditions,
        location
      });
      
      setConversationId(convId);
      const conv = openRouterAI.getConversation(convId);
      setConversation(conv);
      
      // Mensagem inicial da IA
      const initialMessage: OpenRouterMessage = {
        role: 'assistant',
        content: `Olá! Sou seu assistente de IA para corrida e fitness. 🏃‍♂️

Posso ajudar você com:
• Análise de performance e progresso
• Sugestões de rotas personalizadas
• Planos de treino adaptativos
• Conselhos nutricionais
• Prevenção de lesões
• Otimização para condições climáticas
• Motivação e definição de metas

Como posso te ajudar hoje?`
      };
      
      setMessages([initialMessage]);
    } catch (error) {
      console.error('Erro ao inicializar conversa:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !conversationId || isLoading) return;

    const userMessage: OpenRouterMessage = {
      role: 'user',
      content: inputText.trim()
    };

    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Enviar para OpenRouter AI
      const response = await openRouterAI.continueConversation(conversationId, userMessage.content);
      
      const aiMessage: OpenRouterMessage = {
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, aiMessage]);
      hapticSuccess();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const errorMessage: OpenRouterMessage = {
        role: 'assistant',
        content: 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente em alguns instantes.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      hapticWarning();
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const clearConversation = () => {
    if (conversationId) {
      openRouterAI.deleteConversation(conversationId);
      initializeConversation();
    }
  };

  const renderMessage = (message: OpenRouterMessage, index: number) => {
    const isUser = message.role === 'user';
    const isAI = message.role === 'assistant';

    return (
      <View key={index} style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.aiMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isUser ? 
            [styles.userMessageBubble, { backgroundColor: theme.colors.primary }] : 
            [styles.aiMessageBubble, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]
        ]}>
          <View style={styles.messageHeader}>
            {isUser ? (
              <User size={16} color="white" />
            ) : (
              <Bot size={16} color={theme.colors.primary} />
            )}
            <Text style={[
              styles.messageRole,
              isUser ? { color: 'white' } : { color: theme.colors.primary }
            ]}>
              {isUser ? 'Você' : 'IA Assistant'}
            </Text>
          </View>
          <Text style={[
            styles.messageText,
            isUser ? { color: 'white' } : { color: theme.colors.text }
          ]}>
            {message.content}
          </Text>
        </View>
      </View>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={[styles.quickActionsTitle, { color: theme.colors.muted }]}>
        Ações Rápidas:
      </Text>
      <View style={styles.quickActionsGrid}>
        {[
          { label: 'Analisar Performance', action: 'Analise minha performance de corrida dos últimos treinos' },
          { label: 'Sugerir Rotas', action: 'Sugira rotas de 5km perto de mim' },
          { label: 'Plano de Treino', action: 'Crie um plano de treino para correr 10km em 2 meses' },
          { label: 'Conselhos Nutricionais', action: 'Me dê dicas nutricionais para antes e depois da corrida' },
          { label: 'Prevenção de Lesões', action: 'Avalie meu risco de lesão e sugira exercícios preventivos' },
          { label: 'Otimização Climática', action: 'Otimize meu treino para as condições climáticas atuais' }
        ].map((quickAction, index) => (
          <Pressable
            key={index}
            style={[styles.quickActionButton, { borderColor: theme.colors.border }]}
            onPress={() => {
              setInputText(quickAction.action);
              hapticSuccess();
            }}
          >
            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
              {quickAction.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerLeft}>
          <Brain size={24} color={theme.colors.primary} />
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              IA Assistant
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.muted }]}>
              Especialista em Corrida & Fitness
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerButton}
            onPress={clearConversation}
          >
            <RefreshCw size={20} color={theme.colors.muted} />
          </Pressable>
          {onClose && (
            <Pressable
              style={styles.headerButton}
              onPress={onClose}
            >
              <Text style={[styles.closeButton, { color: theme.colors.muted }]}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Mensagens */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => renderMessage(message, index))}
        
        {/* Indicador de digitação */}
        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessageContainer]}>
            <View style={[styles.messageBubble, styles.aiMessageBubble, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={[styles.typingText, { color: theme.colors.muted }]}>
                  IA está digitando...
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Ações rápidas se não houver mensagens suficientes */}
        {messages.length <= 2 && renderQuickActions()}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
        <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
          <TextInput
            style={[styles.textInput, { color: theme.colors.text }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={theme.colors.muted}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <Pressable
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() && !isLoading ? theme.colors.primary : theme.colors.muted }
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Send size={20} color="white" />
            )}
          </Pressable>
        </View>
        
        {/* Contador de caracteres */}
        <Text style={[styles.charCount, { color: theme.colors.muted }]}>
          {inputText.length}/500
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerInfo: {
    gap: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  closeButton: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  messageContainer: {
    flexDirection: 'row',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    gap: 8,
  },
  userMessageBubble: {
    borderBottomRightRadius: 4,
  },
  aiMessageBubble: {
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  messageRole: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  quickActionsContainer: {
    marginTop: 16,
    gap: 12,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  quickActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    gap: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
  },
});