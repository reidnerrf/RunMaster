import React from 'react';
import { useAppState } from './AppState';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { 
  Crown, 
  Check, 
  X,
  Zap,
  MapPin,
  TrendingUp,
  Users,
  Shield,
  Download,
  Heart
} from 'lucide-react';

export function PremiumGate() {
  const { state, actions } = useAppState();

  const premiumFeatures = [
    {
      icon: MapPin,
      title: 'Rotas Personalizadas',
      description: 'IA sugere as melhores rotas baseadas no clima e tráfego',
      category: 'Navegação'
    },
    {
      icon: TrendingUp,
      title: 'Análises Avançadas',
      description: 'Relatórios detalhados e exportação em PDF/Excel',
      category: 'Insights'
    },
    {
      icon: Users,
      title: 'Comunidade Premium',
      description: 'Acesso a grupos exclusivos e mentoria',
      category: 'Social'
    },
    {
      icon: Heart,
      title: 'Monitor de Saúde',
      description: 'Análise de risco de lesão com IA e recomendações',
      category: 'Saúde'
    },
    {
      icon: Download,
      title: 'Exportação Ilimitada',
      description: 'Exporte dados em todos os formatos sem limite',
      category: 'Dados'
    },
    {
      icon: Shield,
      title: 'Backup na Nuvem',
      description: 'Sincronização automática e backup seguro',
      category: 'Segurança'
    }
  ];

  const plans = [
    {
      id: 'monthly',
      name: 'Mensal',
      price: 19.90,
      period: '/mês',
      popular: false,
      savings: null
    },
    {
      id: 'yearly',
      name: 'Anual',
      price: 159.90,
      period: '/ano',
      popular: true,
      savings: 'Economize 33%'
    }
  ];

  const handleUpgrade = (planId: string) => {
    // Simulate payment flow
    setTimeout(() => {
      actions.upgradeToPremium();
    }, 1000);
  };

  if (!state.showPremiumGate) return null;

  return (
    <Sheet open={state.showPremiumGate} onOpenChange={() => actions.hidePremiumGate()}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader className="text-center space-y-4 pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Desbloqueie seu Potencial
            </SheetTitle>
            <p className="text-muted-foreground mt-2">
              Acesse recursos exclusivos para acelerar seus resultados
            </p>
          </div>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-center">Recursos Exclusivos Premium</h3>
            <div className="grid gap-3">
              {premiumFeatures.map((feature, index) => (
                <Card key={index} className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{feature.title}</h4>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            {feature.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="font-semibold text-center">Escolha seu Plano</h3>
            <div className="grid gap-3">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    plan.popular 
                      ? 'ring-2 ring-primary bg-primary/5 border-primary/20' 
                      : 'hover:border-primary/30'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{plan.name}</h4>
                            {plan.popular && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                Mais Popular
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">R$ {plan.price}</span>
                            <span className="text-sm text-muted-foreground">{plan.period}</span>
                          </div>
                          {plan.savings && (
                            <p className="text-xs text-success font-medium">{plan.savings}</p>
                          )}
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleUpgrade(plan.id)}
                        className={plan.popular ? 'button-primary' : ''}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        Escolher
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Guarantee */}
          <Card className="bg-muted/30 border-accent/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-accent" />
                <span className="font-medium text-sm">Garantia de 7 dias</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Teste sem riscos. Cancele a qualquer momento e receba reembolso total.
              </p>
            </CardContent>
          </Card>

          {/* Free vs Premium comparison */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-center">Comparação de Recursos</h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center font-medium">Recurso</div>
              <div className="text-center font-medium">Gratuito</div>
              <div className="text-center font-medium text-primary">Premium</div>
              
              <div className="text-muted-foreground">Corridas ilimitadas</div>
              <div className="text-center"><Check className="w-3 h-3 text-success mx-auto" /></div>
              <div className="text-center"><Check className="w-3 h-3 text-success mx-auto" /></div>
              
              <div className="text-muted-foreground">Rotas personalizadas</div>
              <div className="text-center"><X className="w-3 h-3 text-destructive mx-auto" /></div>
              <div className="text-center"><Check className="w-3 h-3 text-success mx-auto" /></div>
              
              <div className="text-muted-foreground">Análise de lesões</div>
              <div className="text-center">Básica</div>
              <div className="text-center text-primary">Avançada com IA</div>
              
              <div className="text-muted-foreground">Exportação de dados</div>
              <div className="text-center">3/mês</div>
              <div className="text-center text-primary">Ilimitada</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Pagamento seguro</span>
            <span>•</span>
            <span>Cancele quando quiser</span>
            <span>•</span>
            <span>Suporte 24/7</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}