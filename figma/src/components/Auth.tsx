import React, { useState } from 'react';
import { useAppState } from './AppState';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { 
  Activity, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  Apple,
  Chrome,
  Shield
} from 'lucide-react';

export function Auth() {
  const { actions } = useAppState();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: formData.name || 'João Silva',
        email: formData.email || 'joao@example.com',
        avatar: formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JS',
        isPremium: false,
        isAdmin: false,
        preferences: {
          goal: null as const,
          preferredTime: null as const,
          terrain: null as const,
          notifications: true,
          darkMode: 'auto' as const
        },
        stats: {
          totalDistance: 0,
          totalRuns: 0,
          weeklyDistance: 0,
          monthlyDistance: 0
        }
      };
      
      localStorage.setItem('authToken', 'mock-token');
      actions.login(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  const handleSocialLogin = (provider: 'apple' | 'google') => {
    setIsLoading(true);
    
    // Simulate social login
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: provider === 'apple' ? 'User Apple' : 'User Google',
        email: `user@${provider}.com`,
        avatar: provider === 'apple' ? 'UA' : 'UG',
        isPremium: true,
        isAdmin: false,
        preferences: {
          goal: 'performance' as const,
          preferredTime: 'morning' as const,
          terrain: 'road' as const,
          notifications: true,
          darkMode: 'auto' as const
        },
        stats: {
          totalDistance: 245.6,
          totalRuns: 42,
          weeklyDistance: 28.5,
          monthlyDistance: 124.3
        }
      };
      
      localStorage.setItem('authToken', 'mock-token');
      actions.login(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {mode === 'login' ? 'Bem-vindo de volta' :
               mode === 'register' ? 'Criar conta' : 'Recuperar senha'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'login' ? 'Entre para continuar sua jornada' :
               mode === 'register' ? 'Comece sua jornada fitness hoje' : 'Vamos ajudar você a recuperar o acesso'}
            </p>
          </div>
        </div>

        {/* Social Login */}
        {mode !== 'forgot' && (
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-12 text-left"
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
            >
              <Apple className="w-5 h-5 mr-3" />
              Continuar com Apple
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 text-left"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <Chrome className="w-5 h-5 mr-3" />
              Continuar com Google
            </Button>
          </div>
        )}

        {/* Divider */}
        {mode !== 'forgot' && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>
        )}

        {/* Form */}
        <Card className="card-elevated">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome completo</label>
                  <Input
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required={mode === 'register'}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {mode === 'register' && (
                    <p className="text-xs text-muted-foreground">
                      Mínimo 8 caracteres, com pelo menos 1 número e 1 letra maiúscula
                    </p>
                  )}
                </div>
              )}

              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirmar senha</label>
                  <Input
                    type="password"
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              )}

              {mode === 'register' && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      Aceito os <span className="text-primary">Termos de Uso</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="privacy" 
                      checked={formData.agreeToPrivacy}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToPrivacy: checked as boolean }))}
                    />
                    <label htmlFor="privacy" className="text-sm text-muted-foreground">
                      Aceito a <span className="text-primary">Política de Privacidade</span> (LGPD)
                    </label>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full button-primary h-12"
                disabled={isLoading || (mode === 'register' && (!formData.agreeToTerms || !formData.agreeToPrivacy))}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {mode === 'login' ? 'Entrando...' : 
                     mode === 'register' ? 'Criando conta...' : 'Enviando...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {mode === 'login' ? 'Entrar' : 
                     mode === 'register' ? 'Criar conta' : 'Enviar link'}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-3">
          {mode === 'login' && (
            <>
              <Button 
                variant="ghost" 
                onClick={() => setMode('forgot')}
                className="text-sm"
              >
                Esqueci minha senha
              </Button>
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Button 
                  variant="ghost" 
                  onClick={() => setMode('register')}
                  className="p-0 h-auto text-primary"
                >
                  Criar conta
                </Button>
              </p>
            </>
          )}

          {mode === 'register' && (
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Button 
                variant="ghost" 
                onClick={() => setMode('login')}
                className="p-0 h-auto text-primary"
              >
                Fazer login
              </Button>
            </p>
          )}

          {mode === 'forgot' && (
            <Button 
              variant="ghost" 
              onClick={() => setMode('login')}
              className="text-sm"
            >
              Voltar para login
            </Button>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
            <Shield className="w-3 h-3" />
            <span>Seus dados estão protegidos por criptografia</span>
          </div>
        </div>
      </div>
    </div>
  );
}