export interface DesignToken {
  id: string;
  name: string;
  value: string | number;
  category: 'color' | 'typography' | 'spacing' | 'border' | 'shadow' | 'animation';
  description: string;
  usage: string[];
  isDeprecated: boolean;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
    neutral: string[];
    semantic: {
      success: string[];
      warning: string[];
      error: string[];
      info: string[];
    };
  };
  variants: {
    light: { [key: string]: string };
    dark: { [key: string]: string };
  };
}

export interface TypographyScale {
  id: string;
  name: string;
  fontFamily: {
    primary: string;
    secondary: string;
    monospace: string;
  };
  sizes: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
  };
  weights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface SpacingScale {
  id: string;
  name: string;
  base: number;
  scale: number;
  values: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    8: number;
    10: number;
    12: number;
    16: number;
    20: number;
    24: number;
    32: number;
    40: number;
    48: number;
    56: number;
    64: number;
  };
}

export interface ComponentLibrary {
  id: string;
  name: string;
  components: Component[];
  version: string;
  lastUpdated: number;
}

export interface Component {
  id: string;
  name: string;
  category: 'atoms' | 'molecules' | 'organisms' | 'templates';
  variants: ComponentVariant[];
  props: ComponentProp[];
  examples: ComponentExample[];
  documentation: string;
  accessibility: AccessibilityGuidelines;
}

export interface ComponentVariant {
  id: string;
  name: string;
  description: string;
  props: { [key: string]: any };
  preview: string;
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description: string;
}

export interface ComponentExample {
  id: string;
  name: string;
  code: string;
  preview: string;
  description: string;
}

export interface AccessibilityGuidelines {
  wcagLevel: 'A' | 'AA' | 'AAA';
  requirements: string[];
  testing: string[];
  notes: string;
}

export interface DesignSystem {
  tokens: DesignToken[];
  colorPalette: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  components: ComponentLibrary;
}

export class DesignSystemManager {
  private designSystem: DesignSystem;

  constructor() {
    this.designSystem = this.initializeDesignSystem();
  }

  private initializeDesignSystem(): DesignSystem {
    return {
      tokens: this.initializeDesignTokens(),
      colorPalette: this.initializeColorPalette(),
      typography: this.initializeTypography(),
      spacing: this.initializeSpacing(),
      components: this.initializeComponentLibrary()
    };
  }

  private initializeDesignTokens(): DesignToken[] {
    return [
      // Cores
      {
        id: 'color_primary_500',
        name: 'Primary 500',
        value: '#3B82F6',
        category: 'color',
        description: 'Cor primária principal do app',
        usage: ['botões', 'links', 'elementos de destaque'],
        isDeprecated: false
      },
      {
        id: 'color_success_500',
        name: 'Success 500',
        value: '#10B981',
        category: 'color',
        description: 'Cor de sucesso para feedback positivo',
        usage: ['notificações de sucesso', 'indicadores de progresso'],
        isDeprecated: false
      },
      {
        id: 'color_warning_500',
        name: 'Warning 500',
        value: '#F59E0B',
        category: 'color',
        description: 'Cor de aviso para feedback neutro',
        usage: ['alertas', 'notificações'],
        isDeprecated: false
      },
      {
        id: 'color_error_500',
        name: 'Error 500',
        value: '#EF4444',
        category: 'color',
        description: 'Cor de erro para feedback negativo',
        usage: ['mensagens de erro', 'validações'],
        isDeprecated: false
      },

      // Tipografia
      {
        id: 'font_size_base',
        name: 'Font Size Base',
        value: 16,
        category: 'typography',
        description: 'Tamanho base da fonte para o app',
        usage: ['corpo do texto', 'parágrafos'],
        isDeprecated: false
      },
      {
        id: 'font_weight_medium',
        name: 'Font Weight Medium',
        value: 500,
        category: 'typography',
        description: 'Peso médio da fonte',
        usage: ['títulos secundários', 'labels'],
        isDeprecated: false
      },
      {
        id: 'font_weight_bold',
        name: 'Font Weight Bold',
        value: 700,
        category: 'typography',
        description: 'Peso negrito da fonte',
        usage: ['títulos principais', 'destaques'],
        isDeprecated: false
      },

      // Espaçamento
      {
        id: 'spacing_4',
        name: 'Spacing 4',
        value: 16,
        category: 'spacing',
        description: 'Espaçamento padrão de 16px',
        usage: ['margens', 'padding', 'gap'],
        isDeprecated: false
      },
      {
        id: 'spacing_8',
        name: 'Spacing 8',
        value: 32,
        category: 'spacing',
        description: 'Espaçamento grande de 32px',
        usage: ['seções', 'grupos de elementos'],
        isDeprecated: false
      },

      // Bordas
      {
        id: 'border_radius_sm',
        name: 'Border Radius Small',
        value: 4,
        category: 'border',
        description: 'Raio de borda pequeno',
        usage: ['botões', 'inputs', 'cards pequenos'],
        isDeprecated: false
      },
      {
        id: 'border_radius_md',
        name: 'Border Radius Medium',
        value: 8,
        category: 'border',
        description: 'Raio de borda médio',
        usage: ['cards', 'modais', 'botões grandes'],
        isDeprecated: false
      },
      {
        id: 'border_radius_lg',
        name: 'Border Radius Large',
        value: 16,
        category: 'border',
        description: 'Raio de borda grande',
        usage: ['containers', 'seções'],
        isDeprecated: false
      },

      // Sombras
      {
        id: 'shadow_sm',
        name: 'Shadow Small',
        value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        category: 'shadow',
        description: 'Sombra pequena para elevação sutil',
        usage: ['cards', 'botões', 'inputs'],
        isDeprecated: false
      },
      {
        id: 'shadow_md',
        name: 'Shadow Medium',
        value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        category: 'shadow',
        description: 'Sombra média para elevação moderada',
        usage: ['modais', 'dropdowns', 'cards elevados'],
        isDeprecated: false
      },
      {
        id: 'shadow_lg',
        name: 'Shadow Large',
        value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        category: 'shadow',
        description: 'Sombra grande para elevação significativa',
        usage: ['modais grandes', 'tooltips', 'overlays'],
        isDeprecated: false
      },

      // Animações
      {
        id: 'animation_duration_fast',
        name: 'Animation Duration Fast',
        value: 150,
        category: 'animation',
        description: 'Duração rápida para animações',
        usage: ['hover states', 'micro-interactions'],
        isDeprecated: false
      },
      {
        id: 'animation_duration_normal',
        name: 'Animation Duration Normal',
        value: 300,
        category: 'animation',
        description: 'Duração normal para animações',
        usage: ['transições', 'animações de entrada'],
        isDeprecated: false
      },
      {
        id: 'animation_easing',
        name: 'Animation Easing',
        value: 'cubic-bezier(0.4, 0, 0.2, 1)',
        category: 'animation',
        description: 'Função de easing padrão',
        usage: ['todas as animações'],
        isDeprecated: false
      }
    ];
  }

  private initializeColorPalette(): ColorPalette {
    return {
      id: 'color_palette_2024',
      name: 'Paleta de Cores 2024',
      colors: {
        primary: [
          '#1E40AF', // 800
          '#2563EB', // 600
          '#3B82F6', // 500
          '#60A5FA', // 400
          '#93C5FD'  // 300
        ],
        secondary: [
          '#7C3AED', // 600
          '#8B5CF6', // 500
          '#A78BFA', // 400
          '#C4B5FD', // 300
          '#DDD6FE'  // 200
        ],
        accent: [
          '#059669', // 600
          '#10B981', // 500
          '#34D399', // 400
          '#6EE7B7', // 300
          '#A7F3D0'  // 200
        ],
        neutral: [
          '#111827', // 900
          '#374151', // 700
          '#6B7280', // 500
          '#9CA3AF', // 400
          '#D1D5DB', // 300
          '#E5E7EB', // 200
          '#F3F4F6', // 100
          '#FFFFFF'  // 0
        ],
        semantic: {
          success: ['#059669', '#10B981', '#34D399', '#6EE7B7'],
          warning: ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D'],
          error: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5'],
          info: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD']
        }
      },
      variants: {
        light: {
          'background-primary': '#FFFFFF',
          'background-secondary': '#F9FAFB',
          'background-tertiary': '#F3F4F6',
          'text-primary': '#111827',
          'text-secondary': '#374151',
          'text-tertiary': '#6B7280',
          'border-primary': '#E5E7EB',
          'border-secondary': '#D1D5DB'
        },
        dark: {
          'background-primary': '#111827',
          'background-secondary': '#1F2937',
          'background-tertiary': '#374151',
          'text-primary': '#F9FAFB',
          'text-secondary': '#E5E7EB',
          'text-tertiary': '#D1D5DB',
          'border-primary': '#374151',
          'border-secondary': '#4B5563'
        }
      }
    };
  }

  private initializeTypography(): TypographyScale {
    return {
      id: 'typography_scale_2024',
      name: 'Escala Tipográfica 2024',
      fontFamily: {
        primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        secondary: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        monospace: 'JetBrains Mono, "Fira Code", "SF Mono", Monaco, Consolas, monospace'
      },
      sizes: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48
      },
      weights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800
      },
      lineHeights: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75
      }
    };
  }

  private initializeSpacing(): SpacingScale {
    return {
      id: 'spacing_scale_2024',
      name: 'Escala de Espaçamento 2024',
      base: 4,
      scale: 1.5,
      values: {
        0: 0,
        1: 4,
        2: 8,
        3: 12,
        4: 16,
        5: 20,
        6: 24,
        8: 32,
        10: 40,
        12: 48,
        16: 64,
        20: 80,
        24: 96,
        32: 128,
        40: 160,
        48: 192,
        56: 224,
        64: 256
      }
    };
  }

  private initializeComponentLibrary(): ComponentLibrary {
    return {
      id: 'component_library_2024',
      name: 'Biblioteca de Componentes 2024',
      components: [
        {
          id: 'button',
          name: 'Button',
          category: 'atoms',
          variants: [
            {
              id: 'button_primary',
              name: 'Primary',
              description: 'Botão primário para ações principais',
              props: { variant: 'primary', size: 'md' },
              preview: '🔵 Primary Button'
            },
            {
              id: 'button_secondary',
              name: 'Secondary',
              description: 'Botão secundário para ações secundárias',
              props: { variant: 'secondary', size: 'md' },
              preview: '⚪ Secondary Button'
            }
          ],
          props: [
            { name: 'variant', type: 'primary | secondary | outline | ghost', required: false, defaultValue: 'primary', description: 'Variante visual do botão' },
            { name: 'size', type: 'sm | md | lg', required: false, defaultValue: 'md', description: 'Tamanho do botão' },
            { name: 'disabled', type: 'boolean', required: false, defaultValue: false, description: 'Estado desabilitado' }
          ],
          examples: [
            {
              id: 'button_example_1',
              name: 'Botão Primário',
              code: '<Button variant="primary">Clique aqui</Button>',
              preview: '🔵 Clique aqui',
              description: 'Exemplo básico de botão primário'
            }
          ],
          documentation: 'O componente Button é usado para ações e navegação.',
          accessibility: {
            wcagLevel: 'AA',
            requirements: [
              'Deve ter texto descritivo',
              'Deve ser navegável por teclado',
              'Deve ter contraste adequado'
            ],
            testing: [
              'Verificar navegação por teclado',
              'Testar com leitores de tela',
              'Verificar contraste de cores'
            ],
            notes: 'Use aria-label para botões sem texto visível'
          }
        }
      ],
      version: '1.0.0',
      lastUpdated: Date.now()
    };
  }

  // Obter tokens de design
  public getDesignTokens(category?: string): DesignToken[] {
    if (category) {
      return this.designSystem.tokens.filter(token => token.category === category);
    }
    return this.designSystem.tokens;
  }

  // Obter token por ID
  public getDesignTokenById(tokenId: string): DesignToken | undefined {
    return this.designSystem.tokens.find(token => token.id === tokenId);
  }

  // Obter paleta de cores
  public getColorPalette(): ColorPalette {
    return this.designSystem.colorPalette;
  }

  // Obter cores por categoria
  public getColorsByCategory(category: string): string[] {
    const palette = this.designSystem.colorPalette;
    
    switch (category) {
      case 'primary':
        return palette.colors.primary;
      case 'secondary':
        return palette.colors.secondary;
      case 'accent':
        return palette.colors.accent;
      case 'neutral':
        return palette.colors.neutral;
      case 'success':
        return palette.colors.semantic.success;
      case 'warning':
        return palette.colors.semantic.warning;
      case 'error':
        return palette.colors.semantic.error;
      case 'info':
        return palette.colors.semantic.info;
      default:
        return [];
    }
  }

  // Obter variantes de cor
  public getColorVariants(theme: 'light' | 'dark'): { [key: string]: string } {
    return this.designSystem.colorPalette.variants[theme];
  }

  // Obter escala tipográfica
  public getTypography(): TypographyScale {
    return this.designSystem.typography;
  }

  // Obter tamanhos de fonte
  public getFontSizes(): { [key: string]: number } {
    return this.designSystem.typography.sizes;
  }

  // Obter pesos de fonte
  public getFontWeights(): { [key: string]: number } {
    return this.designSystem.typography.weights;
  }

  // Obter escala de espaçamento
  public getSpacing(): SpacingScale {
    return this.designSystem.spacing;
  }

  // Obter valores de espaçamento
  public getSpacingValues(): { [key: string]: number } {
    return this.designSystem.spacing.values;
  }

  // Obter biblioteca de componentes
  public getComponentLibrary(): ComponentLibrary {
    return this.designSystem.components;
  }

  // Obter componentes por categoria
  public getComponentsByCategory(category: string): Component[] {
    return this.designSystem.components.components.filter(component => 
      component.category === category
    );
  }

  // Obter componente por ID
  public getComponentById(componentId: string): Component | undefined {
    return this.designSystem.components.components.find(component => 
      component.id === componentId
    );
  }

  // Gerar CSS custom properties
  public generateCSSCustomProperties(): string {
    let css = ':root {\n';
    
    // Cores
    this.designSystem.tokens
      .filter(token => token.category === 'color')
      .forEach(token => {
        css += `  --${token.name.toLowerCase().replace(/\s+/g, '-')}: ${token.value};\n`;
      });
    
    // Tipografia
    this.designSystem.tokens
      .filter(token => token.category === 'typography')
      .forEach(token => {
        css += `  --${token.name.toLowerCase().replace(/\s+/g, '-')}: ${token.value};\n`;
      });
    
    // Espaçamento
    this.designSystem.tokens
      .filter(token => token.category === 'spacing')
      .forEach(token => {
        css += `  --${token.name.toLowerCase().replace(/\s+/g, '-')}: ${token.value}px;\n`;
      });
    
    // Bordas
    this.designSystem.tokens
      .filter(token => token.category === 'border')
      .forEach(token => {
        css += `  --${token.name.toLowerCase().replace(/\s+/g, '-')}: ${token.value}px;\n`;
      });
    
    // Sombras
    this.designSystem.tokens
      .filter(token => token.category === 'shadow')
      .forEach(token => {
        css += `  --${token.name.toLowerCase().replace(/\s+/g, '-')}: ${token.value};\n`;
      });
    
    // Animações
    this.designSystem.tokens
      .filter(token => token.category === 'animation')
      .forEach(token => {
        if (typeof token.value === 'number') {
          css += `  --${token.name.toLowerCase().replace(/\s+/g, '-')}: ${token.value}ms;\n`;
        } else {
          css += `  --${token.name.toLowerCase().replace(/\s+/g, '-')}: ${token.value};\n`;
        }
      });
    
    css += '}\n';
    return css;
  }

  // Gerar tema escuro
  public generateDarkTheme(): string {
    let css = '@media (prefers-color-scheme: dark) {\n';
    css += '  :root {\n';
    
    const darkColors = this.getColorVariants('dark');
    Object.entries(darkColors).forEach(([key, value]) => {
      css += `    --${key}: ${value};\n`;
    });
    
    css += '  }\n';
    css += '}\n';
    return css;
  }

  // Obter sistema de design completo
  public getDesignSystem(): DesignSystem {
    return this.designSystem;
  }
}

export function createDesignSystemManager(): DesignSystemManager {
  return new DesignSystemManager();
}