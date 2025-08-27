import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { useTheme } from '../Hooks/useTheme';
import {
  AccessibleContainer,
  AccessibleText,
  AccessibleButton,
  AccessibleInput,
} from '../Components/AccessibleComponents';
import {
  getAccessibilitySettings,
  updateAccessibilitySettings,
  checkWCAGCompliance,
  getMetricsHistory,
} from '../utils/accessibilityService';
import {
  getNavigationState,
  getNavigableElements,
  getNavigableLandmarks,
} from '../utils/keyboardNavigation';

// Interface para configurações de acessibilidade
interface AccessibilitySettings {
  wcagLevel: 'A' | 'AA' | 'AAA';
  highContrast: boolean;
  colorBlindSupport: boolean;
  dynamicType: boolean;
  largeText: boolean;
  boldText: boolean;
  reduceMotion: boolean;
  reduceTransparency: boolean;
  keyboardNavigation: boolean;
  voiceOver: boolean;
  talkBack: boolean;
  largeTouchTargets: boolean;
  invertColors: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
}

// Interface para métricas de acessibilidade
interface AccessibilityMetrics {
  overallScore: number;
  wcagCompliance: 'A' | 'AA' | 'AAA' | 'Non-Compliant';
  contrastRatios: {
    text: number;
    background: number;
    ui: number;
    average: number;
  };
  touchTargets: {
    compliant: number;
    nonCompliant: number;
    percentage: number;
  };
  fontSizes: {
    compliant: number;
    nonCompliant: number;
    percentage: number;
  };
  keyboardSupport: {
    supported: number;
    notSupported: number;
    percentage: number;
  };
  issues: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }>;
}

const AccessibilitySettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [settings, setSettings] = useState<AccessibilitySettings>({
    wcagLevel: 'AA',
    highContrast: false,
    colorBlindSupport: false,
    dynamicType: true,
    largeText: false,
    boldText: false,
    reduceMotion: false,
    reduceTransparency: false,
    keyboardNavigation: true,
    voiceOver: false,
    talkBack: false,
    largeTouchTargets: true,
    invertColors: false,
    soundEffects: true,
    hapticFeedback: true,
  });
  
  const [metrics, setMetrics] = useState<AccessibilityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'visual' | 'navigation' | 'testing'>('general');

  // Carregar configurações ao montar o componente
  useEffect(() => {
    loadSettings();
    checkCompliance();
  }, []);

  // Carregar configurações salvas
  const loadSettings = async () => {
    try {
      const savedSettings = await getAccessibilitySettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  // Verificar conformidade WCAG
  const checkCompliance = async () => {
    try {
      setIsLoading(true);
      const complianceMetrics = await checkWCAGCompliance();
      setMetrics(complianceMetrics);
    } catch (error) {
      console.error('Erro ao verificar conformidade:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar configuração
  const updateSetting = async (key: keyof AccessibilitySettings, value: any) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      // Salvar no serviço
      await updateAccessibilitySettings(newSettings);
      
      // Verificar conformidade após mudanças
      if (['highContrast', 'largeText', 'boldText', 'largeTouchTargets'].includes(key)) {
        setTimeout(checkCompliance, 1000);
      }
      
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a configuração');
    }
  };

  // Renderizar aba de configurações gerais
  const renderGeneralTab = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        Configurações Gerais
      </AccessibleText>
      
      {/* Nível WCAG */}
      <View style={styles.settingGroup}>
        <AccessibleText variant="subtitle" size="medium">
          Nível de Conformidade WCAG
        </AccessibleText>
        <AccessibleText variant="body" size="small" style={styles.settingDescription}>
          Define o nível de acessibilidade que a aplicação deve atender
        </AccessibleText>
        
        <View style={styles.radioGroup}>
          {(['A', 'AA', 'AAA'] as const).map((level) => (
            <AccessibleButton
              key={level}
              title={`WCAG ${level}`}
              variant={settings.wcagLevel === level ? 'primary' : 'outline'}
              size="small"
              onPress={() => updateSetting('wcagLevel', level)}
              style={styles.radioButton}
            />
          ))}
        </View>
      </View>

      {/* Suporte a Screen Readers */}
      <View style={styles.settingGroup}>
        <AccessibleText variant="subtitle" size="medium">
          Suporte a Screen Readers
        </AccessibleText>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            VoiceOver (iOS)
          </AccessibleText>
          <Switch
            value={settings.voiceOver}
            onValueChange={(value) => updateSetting('voiceOver', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.voiceOver ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            TalkBack (Android)
          </AccessibleText>
          <Switch
            value={settings.talkBack}
            onValueChange={(value) => updateSetting('talkBack', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.talkBack ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
      </View>

      {/* Feedback Tátil e Sonoro */}
      <View style={styles.settingGroup}>
        <AccessibleText variant="subtitle" size="medium">
          Feedback do Usuário
        </AccessibleText>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            Efeitos Sonoros
          </AccessibleText>
          <Switch
            value={settings.soundEffects}
            onValueChange={(value) => updateSetting('soundEffects', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.soundEffects ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            Vibração (Haptic)
          </AccessibleText>
          <Switch
            value={settings.hapticFeedback}
            onValueChange={(value) => updateSetting('hapticFeedback', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.hapticFeedback ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
      </View>
    </AccessibleContainer>
  );

  // Renderizar aba de configurações visuais
  const renderVisualTab = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        Configurações Visuais
      </AccessibleText>
      
      {/* Contraste e Cores */}
      <View style={styles.settingGroup}>
        <AccessibleText variant="subtitle" size="medium">
          Contraste e Cores
        </AccessibleText>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            Alto Contraste
          </AccessibleText>
          <Switch
            value={settings.highContrast}
            onValueChange={(value) => updateSetting('highContrast', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.highContrast ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            Suporte a Daltonismo
          </AccessibleText>
          <Switch
            value={settings.colorBlindSupport}
            onValueChange={(value) => updateSetting('colorBlindSupport', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.colorBlindSupport ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            Inverter Cores
          </AccessibleText>
          <Switch
            value={settings.invertColors}
            onValueChange={(value) => updateSetting('invertColors', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.invertColors ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
      </View>

      {/* Tipografia */}
      <View style={styles.settingGroup}>
        <AccessibleText variant="subtitle" size="medium">
          Tipografia
        </AccessibleText>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            Dynamic Type
          </AccessibleText>
          <Switch
            value={settings.dynamicType}
            onValueChange={(value) => updateSetting('dynamicType', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.dynamicType ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            Texto Grande
          </AccessibleText>
          <Switch
            value={settings.largeText}
            onValueChange={(value) => updateSetting('largeText', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.largeText ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            Texto em Negrito
          </AccessibleText>
          <Switch
            value={settings.boldText}
            onValueChange={(value) => updateSetting('boldText', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.boldText ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
      </View>

      {/* Animações */}
      <View style={styles.settingGroup}>
        <AccessibleText variant="subtitle" size="medium">
          Animações e Movimento
        </AccessibleText>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            Reduzir Movimento
          </AccessibleText>
          <Switch
            value={settings.reduceMotion}
            onValueChange={(value) => updateSetting('reduceMotion', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.reduceMotion ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            Reduzir Transparência
          </AccessibleText>
          <Switch
            value={settings.reduceTransparency}
            onValueChange={(value) => updateSetting('reduceTransparency', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.reduceTransparency ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
      </View>
    </AccessibleContainer>
  );

  // Renderizar aba de navegação
  const renderNavigationTab = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        Navegação e Interação
      </AccessibleText>
      
      {/* Navegação por Teclado */}
      <View style={styles.settingGroup}>
        <AccessibleText variant="subtitle" size="medium">
          Navegação por Teclado
        </AccessibleText>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            Habilitar Navegação por Teclado
          </AccessibleText>
          <Switch
            value={settings.keyboardNavigation}
            onValueChange={(value) => updateSetting('keyboardNavigation', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.keyboardNavigation ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
        
        {settings.keyboardNavigation && (
          <View style={styles.infoBox}>
            <AccessibleText variant="caption" size="small">
              Use Tab para navegar entre elementos, Enter para ativar e setas para navegar em listas
            </AccessibleText>
          </View>
        )}
      </View>

      {/* Áreas de Toque */}
      <View style={styles.settingGroup}>
        <AccessibleText variant="subtitle" size="medium">
          Áreas de Toque
        </AccessibleText>
        
        <View style={styles.switchRow}>
          <AccessibleText variant="body" size="medium">
            Áreas de Toque Grandes
          </AccessibleText>
          <Switch
            value={settings.largeTouchTargets}
            onValueChange={(value) => updateSetting('largeTouchTargets', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={settings.largeTouchTargets ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
        </View>
        
        {settings.largeTouchTargets && (
          <View style={styles.infoBox}>
            <AccessibleText variant="caption" size="small">
              Todos os elementos interativos terão pelo menos 44x44 pontos
            </AccessibleText>
          </View>
        )}
      </View>

      {/* Estado da Navegação */}
      <View style={styles.settingGroup}>
        <AccessibleText variant="subtitle" size="medium">
          Estado da Navegação
        </AccessibleText>
        
        <View style={styles.statusBox}>
          <AccessibleText variant="body" size="small">
            Elementos Navegáveis: {getNavigableElements().length}
          </AccessibleText>
          <AccessibleText variant="body" size="small">
            Landmarks: {getNavigableLandmarks().length}
          </AccessibleText>
          <AccessibleText variant="body" size="small">
            Modo Teclado: {getNavigationState().keyboardMode ? 'Ativo' : 'Inativo'}
          </AccessibleText>
        </View>
      </View>
    </AccessibleContainer>
  );

  // Renderizar aba de testes
  const renderTestingTab = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        Testes de Acessibilidade
      </AccessibleText>
      
      {/* Verificação WCAG */}
      <View style={styles.settingGroup}>
        <AccessibleText variant="subtitle" size="medium">
          Verificação de Conformidade
        </AccessibleText>
        
        <AccessibleButton
          title="Verificar Conformidade WCAG"
          variant="primary"
          size="medium"
          onPress={checkCompliance}
          loading={isLoading}
          style={styles.testButton}
        />
        
        {metrics && (
          <View style={styles.metricsContainer}>
            <View style={styles.metricRow}>
              <AccessibleText variant="body" size="medium">
                Score Geral:
              </AccessibleText>
              <AccessibleText 
                variant="body" 
                size="medium" 
                weight="bold"
                color={metrics.overallScore >= 85 ? theme.colors.success : 
                       metrics.overallScore >= 70 ? theme.colors.warning : theme.colors.error}
              >
                {metrics.overallScore}/100
              </AccessibleText>
            </View>
            
            <View style={styles.metricRow}>
              <AccessibleText variant="body" size="medium">
                Conformidade:
              </AccessibleText>
              <AccessibleText 
                variant="body" 
                size="medium" 
                weight="bold"
                color={metrics.wcagCompliance === 'Non-Compliant' ? theme.colors.error : theme.colors.success}
              >
                WCAG {metrics.wcagCompliance}
              </AccessibleText>
            </View>
          </View>
        )}
      </View>

      {/* Métricas Detalhadas */}
      {metrics && (
        <View style={styles.settingGroup}>
          <AccessibleText variant="subtitle" size="medium">
            Métricas Detalhadas
          </AccessibleText>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <AccessibleText variant="caption" size="small">
                Contraste
              </AccessibleText>
              <AccessibleText variant="body" size="large" weight="bold">
                {metrics.contrastRatios.average.toFixed(1)}:1
              </AccessibleText>
            </View>
            
            <View style={styles.metricCard}>
              <AccessibleText variant="caption" size="small">
                Áreas de Toque
              </AccessibleText>
              <AccessibleText variant="body" size="large" weight="bold">
                {metrics.touchTargets.percentage}%
              </AccessibleText>
            </View>
            
            <View style={styles.metricCard}>
              <AccessibleText variant="caption" size="small">
                Tipografia
              </AccessibleText>
              <AccessibleText variant="body" size="large" weight="bold">
                {metrics.fontSizes.percentage}%
              </AccessibleText>
            </View>
            
            <View style={styles.metricCard}>
              <AccessibleText variant="caption" size="small">
                Navegação
              </AccessibleText>
              <AccessibleText variant="body" size="large" weight="bold">
                {metrics.keyboardSupport.percentage}%
              </AccessibleText>
            </View>
          </View>
        </View>
      )}

      {/* Problemas Encontrados */}
      {metrics && metrics.issues.length > 0 && (
        <View style={styles.settingGroup}>
          <AccessibleText variant="subtitle" size="medium">
            Problemas Encontrados
          </AccessibleText>
          
          {metrics.issues.map((issue, index) => (
            <View key={index} style={[
              styles.issueCard,
              { borderLeftColor: getSeverityColor(issue.severity) }
            ]}>
              <AccessibleText variant="body" size="medium" weight="semibold">
                {issue.description}
              </AccessibleText>
              <AccessibleText variant="caption" size="small" style={styles.issueRecommendation}>
                {issue.recommendation}
              </AccessibleText>
            </View>
          ))}
        </View>
      )}
    </AccessibleContainer>
  );

  // Obter cor baseada na severidade
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return theme.colors.error;
      case 'high': return theme.colors.warning;
      case 'medium': return theme.colors.secondary;
      case 'low': return theme.colors.success;
      default: return theme.colors.border;
    }
  };

  // Renderizar abas
  const renderTabs = () => {
    const tabs = [
      { id: 'general', title: 'Geral', icon: '⚙️' },
      { id: 'visual', title: 'Visual', icon: '👁️' },
      { id: 'navigation', title: 'Navegação', icon: '⌨️' },
      { id: 'testing', title: 'Testes', icon: '🧪' },
    ];

    return (
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <AccessibleButton
            key={tab.id}
            title={`${tab.icon} ${tab.title}`}
            variant={activeTab === tab.id ? 'primary' : 'ghost'}
            size="small"
            onPress={() => setActiveTab(tab.id as any)}
            style={styles.tabButton}
          />
        ))}
      </View>
    );
  };

  // Renderizar conteúdo da aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralTab();
      case 'visual':
        return renderVisualTab();
      case 'navigation':
        return renderNavigationTab();
      case 'testing':
        return renderTestingTab();
      default:
        return renderGeneralTab();
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <AccessibleContainer variant="section">
        <AccessibleText variant="title" size="extraLarge">
          Configurações de Acessibilidade
        </AccessibleText>
        <AccessibleText variant="subtitle" size="medium" style={styles.subtitle}>
          Personalize a experiência de acessibilidade da aplicação
        </AccessibleText>
      </AccessibleContainer>

      {/* Abas */}
      {renderTabs()}

      {/* Conteúdo da aba ativa */}
      {renderTabContent()}

      {/* Botões de ação */}
      <AccessibleContainer variant="section">
        <View style={styles.actionButtons}>
          <AccessibleButton
            title="Restaurar Padrões"
            variant="outline"
            size="medium"
            onPress={() => {
              Alert.alert(
                'Restaurar Padrões',
                'Tem certeza que deseja restaurar todas as configurações para os valores padrão?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Restaurar', style: 'destructive', onPress: loadSettings },
                ]
              );
            }}
            style={styles.actionButton}
          />
          
          <AccessibleButton
            title="Exportar Configurações"
            variant="secondary"
            size="medium"
            onPress={() => {
              Alert.alert('Exportar', 'Configurações exportadas com sucesso!');
            }}
            style={styles.actionButton}
          />
        </View>
      </AccessibleContainer>
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
  },
  settingGroup: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
  },
  settingDescription: {
    marginTop: 4,
    marginBottom: 12,
    opacity: 0.7,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  radioButton: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoBox: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(0,122,255,0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  statusBox: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    gap: 4,
  },
  testButton: {
    marginTop: 12,
  },
  metricsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    gap: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    alignItems: 'center',
  },
  issueCard: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    borderLeftWidth: 4,
    gap: 4,
  },
  issueRecommendation: {
    fontStyle: 'italic',
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});

export default AccessibilitySettingsScreen;