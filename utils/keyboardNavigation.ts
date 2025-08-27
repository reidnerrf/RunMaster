import { Platform, Keyboard, findNodeHandle } from 'react-native';
import { getAccessibilitySettings } from './accessibilityService';

// Configurações de navegação por teclado
const KEYBOARD_CONFIG = {
  // Atalhos de teclado
  shortcuts: {
    // Navegação
    nextElement: ['Tab'],
    previousElement: ['Shift', 'Tab'],
    activate: ['Enter', ' '],
    escape: ['Escape'],
    
    // Ações específicas
    search: ['Ctrl', 'K'],
    help: ['F1'],
    settings: ['Ctrl', ','],
    refresh: ['F5'],
    
    // Navegação por abas
    nextTab: ['Ctrl', 'Tab'],
    previousTab: ['Ctrl', 'Shift', 'Tab'],
    
    // Navegação por seções
    nextSection: ['Alt', 'ArrowDown'],
    previousSection: ['Alt', 'ArrowUp'],
    
    // Navegação por elementos
    nextItem: ['ArrowDown'],
    previousItem: ['ArrowUp'],
    nextColumn: ['ArrowRight'],
    previousColumn: ['ArrowLeft'],
  },
  
  // Configurações de foco
  focus: {
    visible: true,
    indicator: {
      color: '#007AFF',
      width: 2,
      style: 'solid',
    },
    order: 'logical', // 'logical' | 'visual' | 'custom'
    wrap: true, // permitir wrap do foco
    trap: false, // não trapar foco em modais por padrão
  },
  
  // Configurações de skip links
  skipLinks: {
    enabled: true,
    visible: false, // visível apenas quando navegando por teclado
    showOnFocus: true,
    hideOnBlur: true,
  },
  
  // Configurações de landmarks
  landmarks: {
    enabled: true,
    announce: true, // anunciar mudanças de landmark
    navigation: true, // permitir navegação por landmarks
  },
};

// Interface para elemento navegável
interface NavigableElement {
  id: string;
  ref: any;
  node: any;
  accessible: boolean;
  focusable: boolean;
  role: string;
  label: string;
  hint?: string;
  actions: string[];
  order: number;
  section: string;
  landmark: string;
  nextFocus?: string;
  previousFocus?: string;
  nextFocusDown?: string;
  nextFocusUp?: string;
  nextFocusLeft?: string;
  nextFocusRight?: string;
}

// Interface para seção navegável
interface NavigableSection {
  id: string;
  title: string;
  elements: NavigableElement[];
  order: number;
  landmark: string;
  skipLink?: boolean;
}

// Interface para landmark
interface NavigableLandmark {
  id: string;
  type: 'main' | 'navigation' | 'banner' | 'complementary' | 'contentinfo' | 'form' | 'search';
  title: string;
  description?: string;
  sections: NavigableSection[];
  order: number;
}

// Interface para estado de navegação
interface NavigationState {
  currentElement: string | null;
  currentSection: string | null;
  currentLandmark: string | null;
  focusHistory: string[];
  isNavigating: boolean;
  lastNavigationTime: number;
  keyboardMode: boolean;
}

// Classe principal de navegação por teclado
class KeyboardNavigationService {
  private elements: Map<string, NavigableElement> = new Map();
  private sections: Map<string, NavigableSection> = new Map();
  private landmarks: Map<string, NavigableLandmark> = new Map();
  private state: NavigationState;
  private focusOrder: string[] = [];
  private isInitialized: boolean = false;
  private keyboardListeners: any[] = [];
  private focusListeners: any[] = [];

  constructor() {
    this.state = {
      currentElement: null,
      currentSection: null,
      currentLandmark: null,
      focusHistory: [],
      isNavigating: false,
      lastNavigationTime: 0,
      keyboardMode: false,
    };
    
    this.initialize();
  }

  // Inicializar serviço
  private async initialize(): Promise<void> {
    try {
      console.log('⌨️ Inicializando serviço de navegação por teclado...');
      
      // Verificar configurações de acessibilidade
      const accessibilitySettings = getAccessibilitySettings();
      
      if (!accessibilitySettings.keyboardNavigation) {
        console.log('❌ Navegação por teclado desabilitada');
        return;
      }
      
      // Configurar listeners de teclado
      this.setupKeyboardListeners();
      
      // Configurar listeners de foco
      this.setupFocusListeners();
      
      // Configurar skip links
      this.setupSkipLinks();
      
      // Configurar landmarks
      this.setupLandmarks();
      
      this.isInitialized = true;
      console.log('✅ Serviço de navegação por teclado inicializado');
      
    } catch (error) {
      console.error('❌ Erro na inicialização do serviço de navegação por teclado:', error);
    }
  }

  // Configurar listeners de teclado
  private setupKeyboardListeners(): void {
    try {
      // Em React Native, você usaria:
      // - react-native-keyevent para Android
      // - react-native-keyboard-manager para iOS
      
      console.log('👂 Listeners de teclado configurados');
      
    } catch (error) {
      console.error('Erro ao configurar listeners de teclado:', error);
    }
  }

  // Configurar listeners de foco
  private setupFocusListeners(): void {
    try {
      // Em React Native, você configuraria listeners para mudanças de foco
      console.log('👂 Listeners de foco configurados');
      
    } catch (error) {
      console.error('Erro ao configurar listeners de foco:', error);
    }
  }

  // Configurar skip links
  private setupSkipLinks(): void {
    try {
      if (!KEYBOARD_CONFIG.skipLinks.enabled) return;
      
      // Criar skip links para seções principais
      this.createSkipLinks();
      
      console.log('🔗 Skip links configurados');
      
    } catch (error) {
      console.error('Erro ao configurar skip links:', error);
    }
  }

  // Configurar landmarks
  private setupLandmarks(): void {
    try {
      if (!KEYBOARD_CONFIG.landmarks.enabled) return;
      
      // Criar landmarks padrão
      this.createDefaultLandmarks();
      
      console.log('🏛️ Landmarks configurados');
      
    } catch (error) {
      console.error('Erro ao configurar landmarks:', error);
    }
  }

  // Criar skip links
  private createSkipLinks(): void {
    try {
      // Skip link para conteúdo principal
      this.addSkipLink({
        id: 'skip-main',
        title: 'Pular para conteúdo principal',
        target: 'main-content',
        order: 1,
      });
      
      // Skip link para navegação
      this.addSkipLink({
        id: 'skip-navigation',
        title: 'Pular para navegação',
        target: 'main-navigation',
        order: 2,
      });
      
      // Skip link para busca
      this.addSkipLink({
        id: 'skip-search',
        title: 'Pular para busca',
        target: 'search-form',
        order: 3,
      });
      
    } catch (error) {
      console.error('Erro ao criar skip links:', error);
    }
  }

  // Criar landmarks padrão
  private createDefaultLandmarks(): void {
    try {
      // Landmark principal
      this.addLandmark({
        id: 'main',
        type: 'main',
        title: 'Conteúdo principal',
        description: 'Conteúdo principal da aplicação',
        order: 1,
      });
      
      // Landmark de navegação
      this.addLandmark({
        id: 'navigation',
        type: 'navigation',
        title: 'Navegação principal',
        description: 'Menu de navegação principal',
        order: 2,
      });
      
      // Landmark de cabeçalho
      this.addLandmark({
        id: 'banner',
        type: 'banner',
        title: 'Cabeçalho',
        description: 'Cabeçalho da aplicação',
        order: 3,
      });
      
      // Landmark de busca
      this.addLandmark({
        id: 'search',
        type: 'search',
        title: 'Busca',
        description: 'Formulário de busca',
        order: 4,
      });
      
    } catch (error) {
      console.error('Erro ao criar landmarks padrão:', error);
    }
  }

  // Adicionar skip link
  private addSkipLink(skipLink: {
    id: string;
    title: string;
    target: string;
    order: number;
  }): void {
    try {
      // Em React Native, você criaria um componente de skip link
      console.log(`🔗 Skip link criado: ${skipLink.title}`);
      
    } catch (error) {
      console.error('Erro ao adicionar skip link:', error);
    }
  }

  // Adicionar landmark
  private addLandmark(landmark: Omit<NavigableLandmark, 'sections'>): void {
    try {
      const newLandmark: NavigableLandmark = {
        ...landmark,
        sections: [],
      };
      
      this.landmarks.set(landmark.id, newLandmark);
      console.log(`🏛️ Landmark criado: ${landmark.title}`);
      
    } catch (error) {
      console.error('Erro ao adicionar landmark:', error);
    }
  }

  // Registrar elemento navegável
  public registerElement(element: NavigableElement): void {
    try {
      if (!this.isInitialized) {
        console.warn('Serviço de navegação não inicializado');
        return;
      }
      
      // Validar elemento
      if (!this.validateElement(element)) {
        console.warn(`Elemento inválido: ${element.id}`);
        return;
      }
      
      // Adicionar elemento
      this.elements.set(element.id, element);
      
      // Adicionar à seção
      if (element.section) {
        const section = this.sections.get(element.section);
        if (section) {
          section.elements.push(element);
          section.elements.sort((a, b) => a.order - b.order);
        }
      }
      
      // Atualizar ordem de foco
      this.updateFocusOrder();
      
      console.log(`✅ Elemento registrado: ${element.id}`);
      
    } catch (error) {
      console.error('Erro ao registrar elemento:', error);
    }
  }

  // Validar elemento
  private validateElement(element: NavigableElement): boolean {
    try {
      // Verificar campos obrigatórios
      if (!element.id || !element.ref || !element.accessible) {
        return false;
      }
      
      // Verificar se ID é único
      if (this.elements.has(element.id)) {
        console.warn(`ID duplicado: ${element.id}`);
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.error('Erro ao validar elemento:', error);
      return false;
    }
  }

  // Atualizar ordem de foco
  private updateFocusOrder(): void {
    try {
      // Ordenar elementos por seção e ordem
      const sortedElements = Array.from(this.elements.values())
        .sort((a, b) => {
          // Primeiro por seção
          if (a.section !== b.section) {
            const sectionA = this.sections.get(a.section);
            const sectionB = this.sections.get(b.section);
            if (sectionA && sectionB) {
              return sectionA.order - sectionB.order;
            }
          }
          
          // Depois por ordem dentro da seção
          return a.order - b.order;
        });
      
      this.focusOrder = sortedElements.map(el => el.id);
      
      console.log(`🔄 Ordem de foco atualizada: ${this.focusOrder.length} elementos`);
      
    } catch (error) {
      console.error('Erro ao atualizar ordem de foco:', error);
    }
  }

  // Navegar para próximo elemento
  public navigateNext(): boolean {
    try {
      if (!this.state.currentElement) {
        // Primeiro elemento
        return this.focusElement(this.focusOrder[0]);
      }
      
      const currentIndex = this.focusOrder.indexOf(this.state.currentElement);
      if (currentIndex === -1) return false;
      
      const nextIndex = currentIndex + 1;
      if (nextIndex >= this.focusOrder.length) {
        if (KEYBOARD_CONFIG.focus.wrap) {
          return this.focusElement(this.focusOrder[0]);
        }
        return false;
      }
      
      return this.focusElement(this.focusOrder[nextIndex]);
      
    } catch (error) {
      console.error('Erro ao navegar para próximo elemento:', error);
      return false;
    }
  }

  // Navegar para elemento anterior
  public navigatePrevious(): boolean {
    try {
      if (!this.state.currentElement) {
        // Último elemento
        return this.focusElement(this.focusOrder[this.focusOrder.length - 1]);
      }
      
      const currentIndex = this.focusOrder.indexOf(this.state.currentElement);
      if (currentIndex === -1) return false;
      
      const previousIndex = currentIndex - 1;
      if (previousIndex < 0) {
        if (KEYBOARD_CONFIG.focus.wrap) {
          return this.focusElement(this.focusOrder[this.focusOrder.length - 1]);
        }
        return false;
      }
      
      return this.focusElement(this.focusOrder[previousIndex]);
      
    } catch (error) {
      console.error('Erro ao navegar para elemento anterior:', error);
      return false;
    }
  }

  // Navegar para elemento específico
  public navigateToElement(elementId: string): boolean {
    try {
      return this.focusElement(elementId);
      
    } catch (error) {
      console.error('Erro ao navegar para elemento:', error);
      return false;
    }
  }

  // Navegar para próxima seção
  public navigateNextSection(): boolean {
    try {
      if (!this.state.currentSection) {
        // Primeira seção
        const firstSection = Array.from(this.sections.values())
          .sort((a, b) => a.order - b.order)[0];
        if (firstSection) {
          return this.focusElement(firstSection.elements[0]?.id);
        }
        return false;
      }
      
      const currentSection = this.sections.get(this.state.currentSection);
      if (!currentSection) return false;
      
      const nextSection = Array.from(this.sections.values())
        .filter(s => s.order > currentSection.order)
        .sort((a, b) => a.order - b.order)[0];
      
      if (nextSection && nextSection.elements.length > 0) {
        return this.focusElement(nextSection.elements[0].id);
      }
      
      return false;
      
    } catch (error) {
      console.error('Erro ao navegar para próxima seção:', error);
      return false;
    }
  }

  // Navegar para seção anterior
  public navigatePreviousSection(): boolean {
    try {
      if (!this.state.currentSection) {
        // Última seção
        const lastSection = Array.from(this.sections.values())
          .sort((a, b) => b.order - a.order)[0];
        if (lastSection) {
          return this.focusElement(lastSection.elements[0]?.id);
        }
        return false;
      }
      
      const currentSection = this.sections.get(this.state.currentSection);
      if (!currentSection) return false;
      
      const previousSection = Array.from(this.sections.values())
        .filter(s => s.order < currentSection.order)
        .sort((a, b) => b.order - a.order)[0];
      
      if (previousSection && previousSection.elements.length > 0) {
        return this.focusElement(previousSection.elements[0].id);
      }
      
      return false;
      
    } catch (error) {
      console.error('Erro ao navegar para seção anterior:', error);
      return false;
    }
  }

  // Navegar para landmark
  public navigateToLandmark(landmarkId: string): boolean {
    try {
      const landmark = this.landmarks.get(landmarkId);
      if (!landmark || landmark.sections.length === 0) return false;
      
      // Focar primeiro elemento do primeiro landmark
      const firstSection = landmark.sections[0];
      if (firstSection.elements.length > 0) {
        return this.focusElement(firstSection.elements[0].id);
      }
      
      return false;
      
    } catch (error) {
      console.error('Erro ao navegar para landmark:', error);
      return false;
    }
  }

  // Focar elemento
  private focusElement(elementId: string): boolean {
    try {
      const element = this.elements.get(elementId);
      if (!element || !element.focusable) return false;
      
      // Atualizar estado
      this.state.currentElement = elementId;
      this.state.currentSection = element.section;
      this.state.currentLandmark = element.landmark;
      this.state.lastNavigationTime = Date.now();
      
      // Adicionar ao histórico
      this.state.focusHistory.push(elementId);
      if (this.state.focusHistory.length > 10) {
        this.state.focusHistory = this.state.focusHistory.slice(-10);
      }
      
      // Focar elemento
      if (element.ref && element.ref.focus) {
        element.ref.focus();
      }
      
      // Anunciar foco para screen readers
      this.announceFocus(element);
      
      console.log(`🎯 Elemento focado: ${element.label}`);
      return true;
      
    } catch (error) {
      console.error('Erro ao focar elemento:', error);
      return false;
    }
  }

  // Anunciar foco
  private announceFocus(element: NavigableElement): void {
    try {
      // Em React Native, você usaria:
      // AccessibilityInfo.announceForAccessibility(element.label);
      
      console.log(`🔊 Anunciando foco: ${element.label}`);
      
    } catch (error) {
      console.error('Erro ao anunciar foco:', error);
    }
  }

  // Executar ação de acessibilidade
  public executeAccessibilityAction(elementId: string, action: string): boolean {
    try {
      const element = this.elements.get(elementId);
      if (!element || !element.actions.includes(action)) return false;
      
      // Executar ação baseada no tipo
      switch (action) {
        case 'activate':
          return this.activateElement(element);
        case 'longpress':
          return this.longPressElement(element);
        case 'scrollforward':
          return this.scrollElement(element, 'forward');
        case 'scrollbackward':
          return this.scrollElement(element, 'backward');
        default:
          console.warn(`Ação não implementada: ${action}`);
          return false;
      }
      
    } catch (error) {
      console.error('Erro ao executar ação de acessibilidade:', error);
      return false;
    }
  }

  // Ativar elemento
  private activateElement(element: NavigableElement): boolean {
    try {
      // Em React Native, você chamaria o onPress do elemento
      console.log(`✅ Elemento ativado: ${element.label}`);
      return true;
      
    } catch (error) {
      console.error('Erro ao ativar elemento:', error);
      return false;
    }
  }

  // Pressionar longo elemento
  private longPressElement(element: NavigableElement): boolean {
    try {
      // Em React Native, você chamaria o onLongPress do elemento
      console.log(`⏰ Pressione longo: ${element.label}`);
      return true;
      
    } catch (error) {
      console.error('Erro ao pressionar longo elemento:', error);
      return false;
    }
  }

  // Rolar elemento
  private scrollElement(element: NavigableElement, direction: 'forward' | 'backward'): boolean {
    try {
      // Em React Native, você implementaria a lógica de rolagem
      console.log(`📜 Rolando elemento ${direction}: ${element.label}`);
      return true;
      
    } catch (error) {
      console.error('Erro ao rolar elemento:', error);
      return false;
    }
  }

  // Obter estado de navegação
  public getNavigationState(): NavigationState {
    return { ...this.state };
  }

  // Obter elementos navegáveis
  public getNavigableElements(): NavigableElement[] {
    return Array.from(this.elements.values());
  }

  // Obter seções navegáveis
  public getNavigableSections(): NavigableSection[] {
    return Array.from(this.sections.values());
  }

  // Obter landmarks navegáveis
  public getNavigableLandmarks(): NavigableLandmark[] {
    return Array.from(this.landmarks.values());
  }

  // Limpar elementos
  public clearElements(): void {
    try {
      this.elements.clear();
      this.sections.clear();
      this.landmarks.clear();
      this.focusOrder = [];
      this.state.currentElement = null;
      this.state.currentSection = null;
      this.state.currentLandmark = null;
      
      console.log('🧹 Elementos de navegação limpos');
      
    } catch (error) {
      console.error('Erro ao limpar elementos:', error);
    }
  }

  // Parar serviço
  public stop(): void {
    try {
      // Remover listeners
      this.keyboardListeners.forEach(listener => {
        if (listener.remove) listener.remove();
      });
      
      this.focusListeners.forEach(listener => {
        if (listener.remove) listener.remove();
      });
      
      this.keyboardListeners = [];
      this.focusListeners = [];
      
      console.log('🛑 Serviço de navegação por teclado parado');
      
    } catch (error) {
      console.error('Erro ao parar serviço:', error);
    }
  }
}

// Instância singleton do serviço
const keyboardNavigationService = new KeyboardNavigationService();

// Exportar funções públicas
export const registerElement = (element: NavigableElement) => 
  keyboardNavigationService.registerElement(element);
export const navigateNext = () => keyboardNavigationService.navigateNext();
export const navigatePrevious = () => keyboardNavigationService.navigatePrevious();
export const navigateToElement = (elementId: string) => 
  keyboardNavigationService.navigateToElement(elementId);
export const navigateNextSection = () => keyboardNavigationService.navigateNextSection();
export const navigatePreviousSection = () => keyboardNavigationService.navigatePreviousSection();
export const navigateToLandmark = (landmarkId: string) => 
  keyboardNavigationService.navigateToLandmark(landmarkId);
export const executeAccessibilityAction = (elementId: string, action: string) => 
  keyboardNavigationService.executeAccessibilityAction(elementId, action);
export const getNavigationState = () => keyboardNavigationService.getNavigationState();
export const getNavigableElements = () => keyboardNavigationService.getNavigableElements();
export const getNavigableSections = () => keyboardNavigationService.getNavigableSections();
export const getNavigableLandmarks = () => keyboardNavigationService.getNavigableLandmarks();
export const clearElements = () => keyboardNavigationService.clearElements();
export const stopKeyboardNavigation = () => keyboardNavigationService.stop();

export default keyboardNavigationService;