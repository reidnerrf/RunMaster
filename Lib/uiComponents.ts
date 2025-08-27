export interface UIComponent {
  id: string;
  name: string;
  category: 'atoms' | 'molecules' | 'organisms' | 'templates';
  variants: ComponentVariant[];
  props: ComponentProp[];
  examples: ComponentExample[];
  accessibility: AccessibilityGuidelines;
  designTokens: string[];
}

export interface ComponentVariant {
  id: string;
  name: string;
  description: string;
  props: { [key: string]: any };
  preview: string;
  code: string;
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description: string;
  options?: string[];
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

export interface UIComponentLibrary {
  components: UIComponent[];
  version: string;
  lastUpdated: number;
}

export class UIComponentLibrary {
  private components: UIComponent[] = [];

  constructor() {
    this.initializeComponents();
  }

  private initializeComponents() {
    const components: UIComponent[] = [
      // ATOMS
      {
        id: 'button',
        name: 'Button',
        category: 'atoms',
        variants: [
          {
            id: 'button_primary',
            name: 'Primary',
            description: 'Botão primário para ações principais',
            props: { variant: 'primary', size: 'md', disabled: false },
            preview: '🔵 Primary Button',
            code: '<Button variant="primary" size="md">Primary Button</Button>'
          },
          {
            id: 'button_secondary',
            name: 'Secondary',
            description: 'Botão secundário para ações secundárias',
            props: { variant: 'secondary', size: 'md', disabled: false },
            preview: '⚪ Secondary Button',
            code: '<Button variant="secondary" size="md">Secondary Button</Button>'
          },
          {
            id: 'button_outline',
            name: 'Outline',
            description: 'Botão outline para ações menos importantes',
            props: { variant: 'outline', size: 'md', disabled: false },
            preview: '🔘 Outline Button',
            code: '<Button variant="outline" size="md">Outline Button</Button>'
          },
          {
            id: 'button_ghost',
            name: 'Ghost',
            description: 'Botão fantasma para ações sutis',
            props: { variant: 'ghost', size: 'md', disabled: false },
            preview: '👻 Ghost Button',
            code: '<Button variant="ghost" size="md">Ghost Button</Button>'
          }
        ],
        props: [
          { name: 'variant', type: 'primary | secondary | outline | ghost', required: false, defaultValue: 'primary', description: 'Variante visual do botão', options: ['primary', 'secondary', 'outline', 'ghost'] },
          { name: 'size', type: 'sm | md | lg', required: false, defaultValue: 'md', description: 'Tamanho do botão', options: ['sm', 'md', 'lg'] },
          { name: 'disabled', type: 'boolean', required: false, defaultValue: false, description: 'Estado desabilitado' },
          { name: 'loading', type: 'boolean', required: false, defaultValue: false, description: 'Estado de carregamento' },
          { name: 'icon', type: 'string', required: false, description: 'Ícone do botão' },
          { name: 'iconPosition', type: 'left | right', required: false, defaultValue: 'left', description: 'Posição do ícone', options: ['left', 'right'] }
        ],
        examples: [
          {
            id: 'button_example_1',
            name: 'Botão Primário',
            code: '<Button variant="primary">Clique aqui</Button>',
            preview: '🔵 Clique aqui',
            description: 'Exemplo básico de botão primário'
          },
          {
            id: 'button_example_2',
            name: 'Botão com Ícone',
            code: '<Button variant="primary" icon="🏃‍♂️">Começar Corrida</Button>',
            preview: '🔵 🏃‍♂️ Começar Corrida',
            description: 'Botão com ícone à esquerda'
          }
        ],
        accessibility: {
          wcagLevel: 'AA',
          requirements: [
            'Deve ter texto descritivo',
            'Deve ser navegável por teclado',
            'Deve ter contraste adequado',
            'Deve indicar estado de carregamento'
          ],
          testing: [
            'Verificar navegação por teclado',
            'Testar com leitores de tela',
            'Verificar contraste de cores',
            'Testar estados de loading'
          ],
          notes: 'Use aria-label para botões sem texto visível'
        },
        designTokens: ['color_primary_500', 'border_radius_md', 'shadow_sm', 'animation_duration_fast']
      },

      {
        id: 'input',
        name: 'Input',
        category: 'atoms',
        variants: [
          {
            id: 'input_text',
            name: 'Text',
            description: 'Campo de texto padrão',
            props: { type: 'text', placeholder: 'Digite aqui...', disabled: false },
            preview: '📝 [Digite aqui...]',
            code: '<Input type="text" placeholder="Digite aqui..." />'
          },
          {
            id: 'input_number',
            name: 'Number',
            description: 'Campo numérico',
            props: { type: 'number', placeholder: '0', disabled: false },
            preview: '🔢 [0]',
            code: '<Input type="number" placeholder="0" />'
          },
          {
            id: 'input_email',
            name: 'Email',
            description: 'Campo de email',
            props: { type: 'email', placeholder: 'email@exemplo.com', disabled: false },
            preview: '📧 [email@exemplo.com]',
            code: '<Input type="email" placeholder="email@exemplo.com" />'
          },
          {
            id: 'input_password',
            name: 'Password',
            description: 'Campo de senha',
            props: { type: 'password', placeholder: '••••••••', disabled: false },
            preview: '🔒 [••••••••]',
            code: '<Input type="password" placeholder="••••••••" />'
          }
        ],
        props: [
          { name: 'type', type: 'text | email | password | number | tel | url', required: false, defaultValue: 'text', description: 'Tipo do input', options: ['text', 'email', 'password', 'number', 'tel', 'url'] },
          { name: 'placeholder', type: 'string', required: false, description: 'Texto de placeholder' },
          { name: 'value', type: 'string', required: false, description: 'Valor do input' },
          { name: 'disabled', type: 'boolean', required: false, defaultValue: false, description: 'Estado desabilitado' },
          { name: 'error', type: 'string', required: false, description: 'Mensagem de erro' },
          { name: 'success', type: 'boolean', required: false, defaultValue: false, description: 'Estado de sucesso' },
          { name: 'icon', type: 'string', required: false, description: 'Ícone do input' },
          { name: 'label', type: 'string', required: false, description: 'Label do input' }
        ],
        examples: [
          {
            id: 'input_example_1',
            name: 'Input com Label',
            code: '<Input label="Nome" placeholder="Seu nome completo" />',
            preview: '📝 Nome: [Seu nome completo]',
            description: 'Input com label e placeholder'
          },
          {
            id: 'input_example_2',
            name: 'Input com Erro',
            code: '<Input label="Email" type="email" error="Email inválido" />',
            preview: '📧 Email: [email] ❌ Email inválido',
            description: 'Input com mensagem de erro'
          }
        ],
        accessibility: {
          wcagLevel: 'AA',
          requirements: [
            'Deve ter label associado',
            'Deve indicar estado de erro',
            'Deve ser navegável por teclado',
            'Deve ter contraste adequado'
          ],
          testing: [
            'Verificar associação label-input',
            'Testar navegação por teclado',
            'Verificar mensagens de erro',
            'Testar com leitores de tela'
          ],
          notes: 'Use aria-describedby para mensagens de erro'
        },
        designTokens: ['border_radius_sm', 'shadow_sm', 'color_error_500', 'spacing_4']
      },

      {
        id: 'card',
        name: 'Card',
        category: 'atoms',
        variants: [
          {
            id: 'card_basic',
            name: 'Basic',
            description: 'Card básico com conteúdo simples',
            props: { elevation: 'sm', padding: 'md', border: true },
            preview: '🃏 [Card Content]',
            code: '<Card elevation="sm" padding="md">Card Content</Card>'
          },
          {
            id: 'card_elevated',
            name: 'Elevated',
            description: 'Card com elevação para destaque',
            props: { elevation: 'lg', padding: 'lg', border: false },
            preview: '🃏✨ [Card Content]',
            code: '<Card elevation="lg" padding="lg">Card Content</Card>'
          },
          {
            id: 'card_interactive',
            name: 'Interactive',
            description: 'Card clicável com hover effects',
            props: { elevation: 'md', padding: 'md', interactive: true },
            preview: '🃏👆 [Card Content]',
            code: '<Card elevation="md" padding="md" interactive>Card Content</Card>'
          }
        ],
        props: [
          { name: 'elevation', type: 'none | sm | md | lg', required: false, defaultValue: 'sm', description: 'Nível de elevação', options: ['none', 'sm', 'md', 'lg'] },
          { name: 'padding', type: 'sm | md | lg | xl', required: false, defaultValue: 'md', description: 'Espaçamento interno', options: ['sm', 'md', 'lg', 'xl'] },
          { name: 'border', type: 'boolean', required: false, defaultValue: true, description: 'Exibir borda' },
          { name: 'interactive', type: 'boolean', required: false, defaultValue: false, description: 'Card clicável' },
          { name: 'loading', type: 'boolean', required: false, defaultValue: false, description: 'Estado de carregamento' }
        ],
        examples: [
          {
            id: 'card_example_1',
            name: 'Card Básico',
            code: '<Card>Conteúdo do card</Card>',
            preview: '🃏 Conteúdo do card',
            description: 'Card simples com conteúdo'
          },
          {
            id: 'card_example_2',
            name: 'Card com Header',
            code: '<Card><CardHeader title="Título" /><CardBody>Conteúdo</CardBody></Card>',
            preview: '🃏 📋 Título | Conteúdo',
            description: 'Card com header e body'
          }
        ],
        accessibility: {
          wcagLevel: 'AA',
          requirements: [
            'Deve ter contraste adequado',
            'Deve ser navegável por teclado se interativo',
            'Deve indicar estado de loading'
          ],
          testing: [
            'Verificar contraste de cores',
            'Testar navegação por teclado',
            'Verificar estados de loading'
          ],
          notes: 'Use role="button" para cards interativos'
        },
        designTokens: ['border_radius_md', 'shadow_sm', 'shadow_md', 'shadow_lg', 'spacing_4', 'spacing_8']
      },

      // MOLECULES
      {
        id: 'button_group',
        name: 'Button Group',
        category: 'molecules',
        variants: [
          {
            id: 'button_group_horizontal',
            name: 'Horizontal',
            description: 'Grupo de botões em linha',
            props: { orientation: 'horizontal', spacing: 'sm' },
            preview: '🔵⚪🔘 [Button1] [Button2] [Button3]',
            code: '<ButtonGroup orientation="horizontal"><Button>Button1</Button><Button>Button2</Button><Button>Button3</Button></ButtonGroup>'
          },
          {
            id: 'button_group_vertical',
            name: 'Vertical',
            description: 'Grupo de botões em coluna',
            props: { orientation: 'vertical', spacing: 'sm' },
            preview: '🔵\n⚪\n🔘',
            code: '<ButtonGroup orientation="vertical"><Button>Button1</Button><Button>Button2</Button><Button>Button3</Button></ButtonGroup>'
          }
        ],
        props: [
          { name: 'orientation', type: 'horizontal | vertical', required: false, defaultValue: 'horizontal', description: 'Orientação dos botões', options: ['horizontal', 'vertical'] },
          { name: 'spacing', type: 'xs | sm | md | lg', required: false, defaultValue: 'sm', description: 'Espaçamento entre botões', options: ['xs', 'sm', 'md', 'lg'] },
          { name: 'fullWidth', type: 'boolean', required: false, defaultValue: false, description: 'Ocupar largura total' }
        ],
        examples: [
          {
            id: 'button_group_example_1',
            name: 'Grupo Horizontal',
            code: '<ButtonGroup><Button variant="primary">Sim</Button><Button variant="secondary">Não</Button></ButtonGroup>',
            preview: '🔵⚪ [Sim] [Não]',
            description: 'Grupo de botões para escolhas'
          }
        ],
        accessibility: {
          wcagLevel: 'AA',
          requirements: [
            'Deve ter contraste adequado',
            'Deve ser navegável por teclado',
            'Deve indicar seleção ativa'
          ],
          testing: [
            'Verificar contraste de cores',
            'Testar navegação por teclado',
            'Verificar indicação de seleção'
          ],
          notes: 'Use aria-pressed para botões toggle'
        },
        designTokens: ['spacing_2', 'spacing_4', 'border_radius_sm']
      },

      {
        id: 'form_field',
        name: 'Form Field',
        category: 'molecules',
        variants: [
          {
            id: 'form_field_basic',
            name: 'Basic',
            description: 'Campo de formulário básico',
            props: { label: 'Label', required: false, helperText: '' },
            preview: '📝 Label: [Input]',
            code: '<FormField label="Label"><Input /></FormField>'
          },
          {
            id: 'form_field_required',
            name: 'Required',
            description: 'Campo obrigatório',
            props: { label: 'Label *', required: true, helperText: '' },
            preview: '📝 Label *: [Input]',
            code: '<FormField label="Label" required><Input /></FormField>'
          },
          {
            id: 'form_field_with_helper',
            name: 'With Helper',
            description: 'Campo com texto de ajuda',
            props: { label: 'Label', required: false, helperText: 'Texto de ajuda' },
            preview: '📝 Label: [Input] 💡 Texto de ajuda',
            code: '<FormField label="Label" helperText="Texto de ajuda"><Input /></FormField>'
          }
        ],
        props: [
          { name: 'label', type: 'string', required: true, description: 'Label do campo' },
          { name: 'required', type: 'boolean', required: false, defaultValue: false, description: 'Campo obrigatório' },
          { name: 'helperText', type: 'string', required: false, description: 'Texto de ajuda' },
          { name: 'error', type: 'string', required: false, description: 'Mensagem de erro' },
          { name: 'success', type: 'boolean', required: false, defaultValue: false, description: 'Estado de sucesso' }
        ],
        examples: [
          {
            id: 'form_field_example_1',
            name: 'Campo com Erro',
            code: '<FormField label="Email" error="Email inválido"><Input type="email" /></FormField>',
            preview: '📝 Email: [email] ❌ Email inválido',
            description: 'Campo com mensagem de erro'
          }
        ],
        accessibility: {
          wcagLevel: 'AA',
          requirements: [
            'Deve ter label associado',
            'Deve indicar campos obrigatórios',
            'Deve mostrar mensagens de erro',
            'Deve ter contraste adequado'
          ],
          testing: [
            'Verificar associação label-input',
            'Testar indicação de campos obrigatórios',
            'Verificar mensagens de erro',
            'Testar com leitores de tela'
          ],
          notes: 'Use aria-required para campos obrigatórios'
        },
        designTokens: ['color_error_500', 'color_success_500', 'spacing_2', 'spacing_4']
      },

      // ORGANISMS
      {
        id: 'navigation_header',
        name: 'Navigation Header',
        category: 'organisms',
        variants: [
          {
            id: 'navigation_header_basic',
            name: 'Basic',
            description: 'Header de navegação básico',
            props: { title: 'App Name', showBack: false, actions: [] },
            preview: '📱 [←] App Name [⚙️]',
            code: '<NavigationHeader title="App Name" />'
          },
          {
            id: 'navigation_header_with_back',
            name: 'With Back',
            description: 'Header com botão voltar',
            props: { title: 'Screen Title', showBack: true, actions: [] },
            preview: '📱 [←] Screen Title',
            code: '<NavigationHeader title="Screen Title" showBack />'
          },
          {
            id: 'navigation_header_with_actions',
            name: 'With Actions',
            description: 'Header com ações',
            props: { title: 'Screen Title', showBack: false, actions: ['⚙️', '🔔'] },
            preview: '📱 Screen Title [⚙️] [🔔]',
            code: '<NavigationHeader title="Screen Title" actions={["⚙️", "🔔"]} />'
          }
        ],
        props: [
          { name: 'title', type: 'string', required: true, description: 'Título do header' },
          { name: 'showBack', type: 'boolean', required: false, defaultValue: false, description: 'Mostrar botão voltar' },
          { name: 'actions', type: 'string[]', required: false, description: 'Ações do header' },
          { name: 'transparent', type: 'boolean', required: false, defaultValue: false, description: 'Header transparente' }
        ],
        examples: [
          {
            id: 'navigation_header_example_1',
            name: 'Header Completo',
            code: '<NavigationHeader title="Perfil" showBack actions={["⚙️", "🔔"]} />',
            preview: '📱 [←] Perfil [⚙️] [🔔]',
            description: 'Header com todas as funcionalidades'
          }
        ],
        accessibility: {
          wcagLevel: 'AA',
          requirements: [
            'Deve ter título descritivo',
            'Deve ser navegável por teclado',
            'Deve ter contraste adequado',
            'Deve indicar botão voltar'
          ],
          testing: [
            'Verificar título descritivo',
            'Testar navegação por teclado',
            'Verificar contraste de cores',
            'Testar botão voltar'
          ],
          notes: 'Use aria-label para botões de ação'
        },
        designTokens: ['color_primary_500', 'shadow_sm', 'spacing_4', 'spacing_8']
      },

      {
        id: 'data_table',
        name: 'Data Table',
        category: 'organisms',
        variants: [
          {
            id: 'data_table_basic',
            name: 'Basic',
            description: 'Tabela de dados básica',
            props: { columns: [], data: [], pagination: false, search: false },
            preview: '📊 [Table Content]',
            code: '<DataTable columns={columns} data={data} />'
          },
          {
            id: 'data_table_with_pagination',
            name: 'With Pagination',
            description: 'Tabela com paginação',
            props: { columns: [], data: [], pagination: true, search: false },
            preview: '📊 [Table Content] [1] [2] [3]',
            code: '<DataTable columns={columns} data={data} pagination />'
          },
          {
            id: 'data_table_with_search',
            name: 'With Search',
            description: 'Tabela com busca',
            props: { columns: [], data: [], pagination: false, search: true },
            preview: '📊 🔍 [Search] [Table Content]',
            code: '<DataTable columns={columns} data={data} search />'
          }
        ],
        props: [
          { name: 'columns', type: 'Column[]', required: true, description: 'Definição das colunas' },
          { name: 'data', type: 'any[]', required: true, description: 'Dados da tabela' },
          { name: 'pagination', type: 'boolean', required: false, defaultValue: false, description: 'Habilitar paginação' },
          { name: 'search', type: 'boolean', required: false, defaultValue: false, description: 'Habilitar busca' },
          { name: 'sortable', type: 'boolean', required: false, defaultValue: false, description: 'Colunas ordenáveis' },
          { name: 'selectable', type: 'boolean', required: false, defaultValue: false, description: 'Linhas selecionáveis' }
        ],
        examples: [
          {
            id: 'data_table_example_1',
            name: 'Tabela de Usuários',
            code: '<DataTable columns={userColumns} data={users} pagination search />',
            preview: '📊 🔍 [Search] [User Data] [1] [2] [3]',
            description: 'Tabela completa com usuários'
          }
        ],
        accessibility: {
          wcagLevel: 'AA',
          requirements: [
            'Deve ter cabeçalhos de coluna',
            'Deve ser navegável por teclado',
            'Deve ter contraste adequado',
            'Deve indicar ordenação'
          ],
          testing: [
            'Verificar cabeçalhos de coluna',
            'Testar navegação por teclado',
            'Verificar contraste de cores',
            'Testar ordenação'
          ],
          notes: 'Use scope="col" para cabeçalhos de coluna'
        },
        designTokens: ['border_radius_sm', 'shadow_sm', 'spacing_4', 'color_neutral_500']
      }
    ];

    this.components = components;
  }

  // Obter todos os componentes
  public getAllComponents(): UIComponent[] {
    return this.components;
  }

  // Obter componentes por categoria
  public getComponentsByCategory(category: string): UIComponent[] {
    return this.components.filter(component => component.category === category);
  }

  // Obter componente por ID
  public getComponentById(componentId: string): UIComponent | undefined {
    return this.components.find(component => component.id === componentId);
  }

  // Obter variantes de um componente
  public getComponentVariants(componentId: string): ComponentVariant[] {
    const component = this.getComponentById(componentId);
    return component ? component.variants : [];
  }

  // Obter exemplos de um componente
  public getComponentExamples(componentId: string): ComponentExample[] {
    const component = this.getComponentById(componentId);
    return component ? component.examples : [];
  }

  // Obter props de um componente
  public getComponentProps(componentId: string): ComponentProp[] {
    const component = this.getComponentById(componentId);
    return component ? component.props : [];
  }

  // Gerar código React Native para um componente
  public generateReactNativeCode(componentId: string, variantId: string): string {
    const component = this.getComponentById(componentId);
    if (!component) return '';

    const variant = component.variants.find(v => v.id === variantId);
    if (!variant) return '';

    return variant.code;
  }

  // Gerar código TypeScript para um componente
  public generateTypeScriptCode(componentId: string): string {
    const component = this.getComponentById(componentId);
    if (!component) return '';

    let tsCode = `interface ${component.name}Props {\n`;
    
    component.props.forEach(prop => {
      const required = prop.required ? '' : '?';
      const defaultValue = prop.defaultValue !== undefined ? ` = ${prop.defaultValue}` : '';
      tsCode += `  ${prop.name}${required}: ${prop.type}${defaultValue};\n`;
    });
    
    tsCode += '}\n\n';
    tsCode += `export const ${component.name}: React.FC<${component.name}Props> = (props) => {\n`;
    tsCode += `  // Implementação do componente\n`;
    tsCode += `  return null;\n`;
    tsCode += `};\n`;
    
    return tsCode;
  }

  // Gerar documentação Markdown para um componente
  public generateMarkdownDocumentation(componentId: string): string {
    const component = this.getComponentById(componentId);
    if (!component) return '';

    let md = `# ${component.name}\n\n`;
    md += `${component.category.charAt(0).toUpperCase() + component.category.slice(1)} component\n\n`;
    
    // Variantes
    md += `## Variants\n\n`;
    component.variants.forEach(variant => {
      md += `### ${variant.name}\n\n`;
      md += `${variant.description}\n\n`;
      md += `\`\`\`tsx\n${variant.code}\n\`\`\`\n\n`;
    });
    
    // Props
    md += `## Props\n\n`;
    md += `| Name | Type | Required | Default | Description |\n`;
    md += `|------|------|----------|---------|-------------|\n`;
    component.props.forEach(prop => {
      const required = prop.required ? 'Yes' : 'No';
      const defaultValue = prop.defaultValue !== undefined ? prop.defaultValue : '-';
      md += `| ${prop.name} | ${prop.type} | ${required} | ${defaultValue} | ${prop.description} |\n`;
    });
    
    // Exemplos
    md += `\n## Examples\n\n`;
    component.examples.forEach(example => {
      md += `### ${example.name}\n\n`;
      md += `${example.description}\n\n`;
      md += `\`\`\`tsx\n${example.code}\n\`\`\`\n\n`;
    });
    
    // Acessibilidade
    md += `## Accessibility\n\n`;
    md += `**WCAG Level:** ${component.accessibility.wcagLevel}\n\n`;
    md += `### Requirements\n\n`;
    component.accessibility.requirements.forEach(req => {
      md += `- ${req}\n`;
    });
    
    md += `\n### Testing\n\n`;
    component.accessibility.testing.forEach(test => {
      md += `- ${test}\n`;
    });
    
    if (component.accessibility.notes) {
      md += `\n### Notes\n\n`;
      md += `${component.accessibility.notes}\n`;
    }
    
    return md;
  }

  // Gerar documentação completa da biblioteca
  public generateLibraryDocumentation(): string {
    let md = `# UI Component Library\n\n`;
    md += `Versão: ${this.components[0]?.version || '1.0.0'}\n\n`;
    
    // Categorias
    const categories = ['atoms', 'molecules', 'organisms', 'templates'];
    
    categories.forEach(category => {
      const components = this.getComponentsByCategory(category);
      if (components.length > 0) {
        md += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
        
        components.forEach(component => {
          md += `- [${component.name}](#${component.name.toLowerCase()})\n`;
        });
        
        md += `\n`;
      }
    });
    
    // Documentação de cada componente
    this.components.forEach(component => {
      md += this.generateMarkdownDocumentation(component.id);
      md += `\n---\n\n`;
    });
    
    return md;
  }

  // Obter estatísticas da biblioteca
  public getLibraryStats(): {
    totalComponents: number;
    componentsByCategory: { [key: string]: number };
    totalVariants: number;
    totalExamples: number;
    totalProps: number;
  } {
    const totalComponents = this.components.length;
    const componentsByCategory: { [key: string]: number } = {};
    let totalVariants = 0;
    let totalExamples = 0;
    let totalProps = 0;
    
    this.components.forEach(component => {
      componentsByCategory[component.category] = (componentsByCategory[component.category] || 0) + 1;
      totalVariants += component.variants.length;
      totalExamples += component.examples.length;
      totalProps += component.props.length;
    });
    
    return {
      totalComponents,
      componentsByCategory,
      totalVariants,
      totalExamples,
      totalProps
    };
  }
}

export function createUIComponentLibrary(): UIComponentLibrary {
  return new UIComponentLibrary();
}