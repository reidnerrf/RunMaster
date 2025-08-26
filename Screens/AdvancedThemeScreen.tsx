import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  TextInput,
} from 'react-native';
import { useAdvancedTheme, useSeasonalTheme, useNightMode, usePersonalityTheme, useAccessibilityTheme, useThemeSettings } from '../Hooks/useAdvancedTheme';
import {
  AccessibleContainer,
  AccessibleText,
  AccessibleButton,
  AccessibleInput,
} from '../Components/AccessibleComponents';
import { AnimatedEntry, AnimatedTransition } from '../Components/AnimatedComponents';
import { ThemeMode, PersonalityType } from '../utils/themeService';

const AdvancedThemeScreen: React.FC = () => {
  const {
    currentTheme,
    userPreferences,
    availableThemes,
    setThemeMode,
    setPersonalityType,
    setHighContrast,
    setAutoNightMode,
    setNightModeSchedule,
    setSeasonalThemes,
    setCustomColors,
    exportTheme,
    importTheme,
    clearData,
    isLoading,
    error,
  } = useAdvancedTheme();

  const { currentSeason, seasonInfo } = useSeasonalTheme();
  const { isNight, timeInfo } = useNightMode();
  const { personalityTypes, currentPersonality, setPersonalityType: setPersonality } = usePersonalityTheme();
  const { accessibilityFeatures, accessibilityScore } = useAccessibilityTheme();
  const { themeSettings, nightModeSchedule, hasAutoSettings } = useThemeSettings();

  const [activeTab, setActiveTab] = useState<'themes' | 'personality' | 'accessibility' | 'auto' | 'custom' | 'export'>('themes');
  const [customColor, setCustomColor] = useState('');
  const [importData, setImportData] = useState('');

  // Função para exportar tema
  const handleExportTheme = () => {
    try {
      const themeData = exportTheme();
      if (themeData) {
        Alert.alert(
          'Tema Exportado',
          'Tema exportado com sucesso! Copie o JSON abaixo:',
          [
            { text: 'Copiar', onPress: () => console.log('Copiar tema:', themeData) },
            { text: 'OK' },
          ]
        );
      }
    } catch (err) {
      Alert.alert('Erro', 'Erro ao exportar tema');
    }
  };

  // Função para importar tema
  const handleImportTheme = async () => {
    try {
      if (!importData.trim()) {
        Alert.alert('Erro', 'Por favor, insira os dados do tema');
        return;
      }

      const success = await importTheme(importData);
      if (success) {
        Alert.alert('Sucesso', 'Tema importado com sucesso!');
        setImportData('');
      } else {
        Alert.alert('Erro', 'Formato de tema inválido');
      }
    } catch (err) {
      Alert.alert('Erro', 'Erro ao importar tema');
    }
  };

  // Função para limpar dados
  const handleClearData = () => {
    Alert.alert(
      'Limpar Dados',
      'Tem certeza que deseja limpar todas as configurações de tema?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: clearData },
      ]
    );
  };

  // Renderizar seleção de temas
  const renderThemeSelection = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        🎨 Seleção de Temas
      </AccessibleText>
      
      <View style={styles.themeGrid}>
        {availableThemes.map((theme) => (
          <AnimatedEntry
            key={theme.id}
            enterAnimation={{ type: 'scale', scale: 0.9, delay: 100 }}
            style={styles.themeCard}
          >
            <AccessibleContainer
              variant="card"
              style={[
                styles.themeCardContent,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: currentTheme.id === theme.id ? theme.colors.primary : theme.colors.border,
                  borderWidth: currentTheme.id === theme.id ? 3 : 1,
                },
              ]}
            >
              <AccessibleText
                variant="subtitle"
                size="medium"
                style={{ color: theme.colors.text }}
              >
                {theme.name}
              </AccessibleText>
              
              <AccessibleText
                variant="body"
                size="small"
                style={{ color: theme.colors.textSecondary }}
              >
                {theme.description}
              </AccessibleText>
              
              <View style={styles.themePreview}>
                <View
                  style={[
                    styles.colorPreview,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
                <View
                  style={[
                    styles.colorPreview,
                    { backgroundColor: theme.colors.secondary },
                  ]}
                />
                <View
                  style={[
                    styles.colorPreview,
                    { backgroundColor: theme.colors.accent },
                  ]}
                />
              </View>
              
              <AccessibleButton
                title={currentTheme.id === theme.id ? 'Ativo' : 'Ativar'}
                variant={currentTheme.id === theme.id ? 'primary' : 'outline'}
                size="small"
                onPress={() => setThemeMode(theme.mode)}
                disabled={currentTheme.id === theme.id}
                style={styles.themeButton}
              />
            </AccessibleContainer>
          </AnimatedEntry>
        ))}
      </View>
    </AccessibleContainer>
  );

  // Renderizar seleção de personalidade
  const renderPersonalitySelection = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        🧠 Personalidade
      </AccessibleText>
      
      <AccessibleText variant="body" size="medium" style={styles.description}>
        Escolha um tipo de personalidade para personalizar as cores do tema
      </AccessibleText>
      
      <View style={styles.personalityGrid}>
        {personalityTypes.map((personality) => (
          <AnimatedEntry
            key={personality.id}
            enterAnimation={{ type: 'slide', direction: 'up', delay: 100 }}
            style={styles.personalityCard}
          >
            <AccessibleContainer
              variant="card"
              style={[
                styles.personalityCardContent,
                {
                  borderColor: currentPersonality?.id === personality.id ? currentTheme.colors.primary : currentTheme.colors.border,
                  borderWidth: currentPersonality?.id === personality.id ? 3 : 1,
                },
              ]}
            >
              <AccessibleText variant="title" size="large">
                {personality.icon}
              </AccessibleText>
              
              <AccessibleText variant="subtitle" size="medium">
                {personality.name}
              </AccessibleText>
              
              <AccessibleText variant="body" size="small" style={styles.personalityDescription}>
                {personality.description}
              </AccessibleText>
              
              <AccessibleButton
                title={currentPersonality?.id === personality.id ? 'Selecionado' : 'Selecionar'}
                variant={currentPersonality?.id === personality.id ? 'primary' : 'outline'}
                size="small"
                onPress={() => setPersonality(personality.id as PersonalityType)}
                style={styles.personalityButton}
              />
            </AccessibleContainer>
          </AnimatedEntry>
        ))}
      </View>
    </AccessibleContainer>
  );

  // Renderizar configurações de acessibilidade
  const renderAccessibilitySettings = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        ♿ Acessibilidade
      </AccessibleText>
      
      <View style={styles.accessibilityHeader}>
        <AccessibleText variant="subtitle" size="medium">
          Pontuação de Acessibilidade
        </AccessibleText>
        <View style={styles.scoreContainer}>
          <AccessibleText variant="title" size="large">
            {accessibilityScore}/5
          </AccessibleText>
        </View>
      </View>
      
      <View style={styles.accessibilityGrid}>
        {accessibilityFeatures.map((feature) => (
          <AnimatedEntry
            key={feature.id}
            enterAnimation={{ type: 'fade', delay: 100 }}
            style={styles.accessibilityCard}
          >
            <AccessibleContainer variant="card">
              <View style={styles.accessibilityHeader}>
                <View style={styles.accessibilityIcon}>
                  <AccessibleText variant="title" size="large">
                    {feature.icon}
                  </AccessibleText>
                </View>
                
                <View style={styles.accessibilityContent}>
                  <AccessibleText variant="subtitle" size="medium">
                    {feature.name}
                  </AccessibleText>
                  
                  <AccessibleText variant="body" size="small" style={styles.accessibilityDescription}>
                    {feature.description}
                  </AccessibleText>
                </View>
                
                <Switch
                  value={feature.enabled}
                  onValueChange={feature.setEnabled}
                  trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
                  thumbColor={feature.enabled ? currentTheme.colors.background : currentTheme.colors.textSecondary}
                />
              </View>
            </AccessibleContainer>
          </AnimatedEntry>
        ))}
      </View>
    </AccessibleContainer>
  );

  // Renderizar configurações automáticas
  const renderAutoSettings = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        ⚙️ Configurações Automáticas
      </AccessibleText>
      
      <View style={styles.autoSettingsGrid}>
        {themeSettings.map((setting) => (
          <AnimatedEntry
            key={setting.id}
            enterAnimation={{ type: 'slide', direction: 'right', delay: 100 }}
            style={styles.autoSettingCard}
          >
            <AccessibleContainer variant="card">
              <View style={styles.autoSettingHeader}>
                <View style={styles.autoSettingIcon}>
                  <AccessibleText variant="title" size="large">
                    {setting.icon}
                  </AccessibleText>
                </View>
                
                <View style={styles.autoSettingContent}>
                  <AccessibleText variant="subtitle" size="medium">
                    {setting.name}
                  </AccessibleText>
                  
                  <AccessibleText variant="body" size="small" style={styles.autoSettingDescription}>
                    {setting.description}
                  </AccessibleText>
                </View>
                
                <Switch
                  value={setting.enabled}
                  onValueChange={setting.setEnabled}
                  trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
                  thumbColor={setting.enabled ? currentTheme.colors.background : currentTheme.colors.textSecondary}
                />
              </View>
              
              {/* Configurações específicas do modo noturno */}
              {setting.id === 'autoNightMode' && setting.enabled && (
                <AnimatedTransition
                  isVisible={setting.enabled}
                  transitionAnimation={{ type: 'slide', direction: 'up', duration: 300 }}
                  style={styles.nightModeSettings}
                >
                  <View style={styles.timeInputContainer}>
                    <AccessibleText variant="body" size="small">
                      Início:
                    </AccessibleText>
                    <AccessibleInput
                      value={nightModeSchedule.start}
                      onChangeText={(text) => nightModeSchedule.setSchedule(text, nightModeSchedule.end)}
                      placeholder="20:00"
                      style={styles.timeInput}
                    />
                  </View>
                  
                  <View style={styles.timeInputContainer}>
                    <AccessibleText variant="body" size="small">
                      Fim:
                    </AccessibleText>
                    <AccessibleInput
                      value={nightModeSchedule.end}
                      onChangeText={(text) => nightModeSchedule.setSchedule(nightModeSchedule.start, text)}
                      placeholder="06:00"
                      style={styles.timeInput}
                    />
                  </View>
                </AnimatedTransition>
              )}
            </AccessibleContainer>
          </AnimatedEntry>
        ))}
      </View>
      
      {/* Informações de contexto */}
      <AccessibleContainer variant="card" style={styles.contextInfo}>
        <AccessibleText variant="subtitle" size="medium">
          📅 Informações de Contexto
        </AccessibleText>
        
        <View style={styles.contextGrid}>
          <View style={styles.contextItem}>
            <AccessibleText variant="caption" size="small">
              Estação Atual
            </AccessibleText>
            <AccessibleText variant="body" size="medium">
              {seasonInfo.season.charAt(0).toUpperCase() + seasonInfo.season.slice(1)}
            </AccessibleText>
          </View>
          
          <View style={styles.contextItem}>
            <AccessibleText variant="caption" size="small">
              Período do Dia
            </AccessibleText>
            <AccessibleText variant="body" size="medium">
              {timeInfo.timeOfDay.charAt(0).toUpperCase() + timeInfo.timeOfDay.slice(1)}
            </AccessibleText>
          </View>
          
          <View style={styles.contextItem}>
            <AccessibleText variant="caption" size="small">
              Modo Noturno
            </AccessibleText>
            <AccessibleText variant="body" size="medium">
              {isNight ? 'Ativo' : 'Inativo'}
            </AccessibleText>
          </View>
        </View>
      </AccessibleContainer>
    </AccessibleContainer>
  );

  // Renderizar personalização de cores
  const renderCustomColors = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        🎨 Cores Personalizadas
      </AccessibleText>
      
      <AccessibleText variant="body" size="medium" style={styles.description}>
        Personalize cores específicas do tema atual
      </AccessibleText>
      
      <View style={styles.colorCustomization}>
        <View style={styles.colorInputContainer}>
          <AccessibleText variant="body" size="small">
            Cor Primária (hex):
          </AccessibleText>
          <AccessibleInput
            value={customColor}
            onChangeText={setCustomColor}
            placeholder="#007AFF"
            style={styles.colorInput}
          />
          <AccessibleButton
            title="Aplicar"
            variant="primary"
            size="small"
            onPress={() => {
              if (customColor.match(/^#[0-9A-F]{6}$/i)) {
                setCustomColors({ primary: customColor });
                setCustomColor('');
              } else {
                Alert.alert('Erro', 'Formato de cor inválido. Use #RRGGBB');
              }
            }}
            disabled={!customColor.match(/^#[0-9A-F]{6}$/i)}
            style={styles.colorButton}
          />
        </View>
        
        <AccessibleText variant="caption" size="small" style={styles.colorHelp}>
          Digite cores no formato hexadecimal (#RRGGBB)
        </AccessibleText>
      </View>
    </AccessibleContainer>
  );

  // Renderizar exportação/importação
  const renderExportImport = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        📤 Exportar/Importar
      </AccessibleText>
      
      <View style={styles.exportImportGrid}>
        {/* Exportar */}
        <AccessibleContainer variant="card">
          <AccessibleText variant="subtitle" size="medium">
            📤 Exportar Tema
          </AccessibleText>
          
          <AccessibleText variant="body" size="small" style={styles.exportDescription}>
            Exporte o tema atual para compartilhar ou fazer backup
          </AccessibleText>
          
          <AccessibleButton
            title="Exportar Tema"
            variant="primary"
            size="medium"
            onPress={handleExportTheme}
            style={styles.exportButton}
          />
        </AccessibleContainer>
        
        {/* Importar */}
        <AccessibleContainer variant="card">
          <AccessibleText variant="subtitle" size="medium">
            📥 Importar Tema
          </AccessibleText>
          
          <AccessibleText variant="body" size="small" style={styles.importDescription}>
            Importe um tema de um arquivo JSON
          </AccessibleText>
          
          <AccessibleInput
            value={importData}
            onChangeText={setImportData}
            placeholder="Cole o JSON do tema aqui..."
            multiline
            numberOfLines={4}
            style={styles.importInput}
          />
          
          <AccessibleButton
            title="Importar Tema"
            variant="outline"
            size="medium"
            onPress={handleImportTheme}
            disabled={!importData.trim()}
            style={styles.importButton}
          />
        </AccessibleContainer>
        
        {/* Limpar Dados */}
        <AccessibleContainer variant="card">
          <AccessibleText variant="subtitle" size="medium">
            🗑️ Limpar Dados
          </AccessibleText>
          
          <AccessibleText variant="body" size="small" style={styles.clearDescription}>
            Remove todas as configurações personalizadas
          </AccessibleText>
          
          <AccessibleButton
            title="Limpar Dados"
            variant="outline"
            size="medium"
            onPress={handleClearData}
            style={[styles.clearButton, { borderColor: currentTheme.colors.error }]}
          />
        </AccessibleContainer>
      </View>
    </AccessibleContainer>
  );

  // Renderizar abas
  const renderTabs = () => {
    const tabs = [
      { id: 'themes', title: 'Temas', icon: '🎨' },
      { id: 'personality', title: 'Personalidade', icon: '🧠' },
      { id: 'accessibility', title: 'Acessibilidade', icon: '♿' },
      { id: 'auto', title: 'Automático', icon: '⚙️' },
      { id: 'custom', title: 'Personalizar', icon: '🔧' },
      { id: 'export', title: 'Exportar', icon: '📤' },
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
      case 'themes':
        return renderThemeSelection();
      case 'personality':
        return renderPersonalitySelection();
      case 'accessibility':
        return renderAccessibilitySettings();
      case 'auto':
        return renderAutoSettings();
      case 'custom':
        return renderCustomColors();
      case 'export':
        return renderExportImport();
      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentTheme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <AccessibleContainer variant="section">
        <AccessibleText variant="title" size="extraLarge">
          🎨 Configurações de Tema Avançado
        </AccessibleText>
        <AccessibleText variant="subtitle" size="medium" style={styles.subtitle}>
          Personalize completamente a aparência da aplicação
        </AccessibleText>
      </AccessibleContainer>

      {/* Abas */}
      {renderTabs()}

      {/* Conteúdo da aba ativa */}
      {renderTabContent()}

      {/* Indicador de carregamento */}
      {isLoading && (
        <AccessibleContainer variant="card" style={styles.loadingContainer}>
          <AccessibleText variant="body" size="medium">
            ⏳ Carregando...
          </AccessibleText>
        </AccessibleContainer>
      )}

      {/* Exibição de erro */}
      {error && (
        <AccessibleContainer variant="card" style={styles.errorContainer}>
          <AccessibleText variant="body" size="medium" style={{ color: currentTheme.colors.error }}>
            ❌ {error}
          </AccessibleText>
        </AccessibleContainer>
      )}
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
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    minWidth: '30%',
  },
  description: {
    marginTop: 8,
    marginBottom: 16,
    opacity: 0.8,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  themeCard: {
    width: '48%',
    minHeight: 160,
  },
  themeCardContent: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  themePreview: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  themeButton: {
    marginTop: 8,
  },
  personalityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  personalityCard: {
    width: '48%',
    minHeight: 180,
  },
  personalityCardContent: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  personalityDescription: {
    textAlign: 'center',
    opacity: 0.8,
  },
  personalityButton: {
    marginTop: 8,
  },
  accessibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  accessibilityGrid: {
    gap: 12,
    marginTop: 16,
  },
  accessibilityCard: {
    // Estilos para card de acessibilidade
  },
  accessibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accessibilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessibilityContent: {
    flex: 1,
  },
  accessibilityDescription: {
    opacity: 0.8,
    marginTop: 4,
  },
  autoSettingsGrid: {
    gap: 16,
    marginTop: 16,
  },
  autoSettingCard: {
    // Estilos para card de configuração automática
  },
  autoSettingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  autoSettingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoSettingContent: {
    flex: 1,
  },
  autoSettingDescription: {
    opacity: 0.8,
    marginTop: 4,
  },
  nightModeSettings: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  contextInfo: {
    marginTop: 24,
  },
  contextGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  contextItem: {
    alignItems: 'center',
    minWidth: '30%',
  },
  colorCustomization: {
    marginTop: 16,
  },
  colorInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  colorInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  colorButton: {
    minWidth: 80,
  },
  colorHelp: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
  exportImportGrid: {
    gap: 16,
    marginTop: 16,
  },
  exportDescription: {
    marginTop: 8,
    marginBottom: 16,
    opacity: 0.8,
  },
  exportButton: {
    alignSelf: 'flex-start',
  },
  importDescription: {
    marginTop: 8,
    marginBottom: 16,
    opacity: 0.8,
  },
  importInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  importButton: {
    alignSelf: 'flex-start',
  },
  clearDescription: {
    marginTop: 8,
    marginBottom: 16,
    opacity: 0.8,
  },
  clearButton: {
    alignSelf: 'flex-start',
  },
  loadingContainer: {
    marginTop: 24,
    alignItems: 'center',
    padding: 16,
  },
  errorContainer: {
    marginTop: 24,
    padding: 16,
  },
});

export default AdvancedThemeScreen;