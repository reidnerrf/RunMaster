export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'pix' | 'bank_transfer';
  name: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isVerified: boolean;
  metadata: {
    country?: string;
    funding?: string;
    issuer?: string;
  };
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  paymentMethodId: string;
  description: string;
  metadata: {
    userId: string;
    planId: string;
    source: 'app' | 'website' | 'subscription';
  };
  createdAt: number;
  updatedAt: number;
  confirmationUrl?: string;
  errorMessage?: string;
}

export interface SubscriptionPayment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
  paymentMethodId: string;
  billingCycle: 'monthly' | 'annual' | 'lifetime';
  nextBillingDate: number;
  retryCount: number;
  maxRetries: number;
  metadata: {
    userId: string;
    planId: string;
    platform: 'ios' | 'android' | 'web';
  };
}

export interface IAPProduct {
  id: string;
  name: string;
  description: string;
  type: 'subscription' | 'consumable' | 'non_consumable';
  platform: 'ios' | 'android';
  price: {
    amount: number;
    currency: string;
    localizedPrice: string;
  };
  subscriptionGroup?: string;
  trialPeriod?: number; // dias
  introductoryPrice?: {
    amount: number;
    currency: string;
    period: number;
  };
  isActive: boolean;
}

export interface IAPTransaction {
  id: string;
  productId: string;
  userId: string;
  platform: 'ios' | 'android';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  receiptData?: string;
  transactionId?: string;
  purchaseDate: number;
  expirationDate?: number;
  metadata: {
    originalTransactionId?: string;
    webOrderLineItemId?: string;
    isTrialPeriod?: boolean;
    isIntroductoryPrice?: boolean;
  };
}

export interface PaymentProvider {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'apple_pay' | 'google_pay' | 'pix';
  isEnabled: boolean;
  config: {
    apiKey?: string;
    secretKey?: string;
    webhookSecret?: string;
    environment: 'sandbox' | 'production';
    supportedCurrencies: string[];
    supportedCountries: string[];
  };
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
}

export interface PaymentManager {
  providers: PaymentProvider[];
  paymentMethods: Map<string, PaymentMethod[]>;
  paymentIntents: PaymentIntent[];
  subscriptions: SubscriptionPayment[];
  iapProducts: IAPProduct[];
  iapTransactions: IAPTransaction[];
}

export class PaymentManager {
  private providers: PaymentProvider[] = [];
  private paymentMethods: Map<string, PaymentMethod[]> = new Map();
  private paymentIntents: PaymentIntent[] = [];
  private subscriptions: SubscriptionPayment[] = [];
  private iapProducts: IAPProduct[] = [];
  private iapTransactions: IAPTransaction[] = [];

  constructor() {
    this.initializePaymentProviders();
    this.initializeIAPProducts();
  }

  private initializePaymentProviders() {
    const providers: PaymentProvider[] = [
      // Stripe
      {
        id: 'stripe',
        name: 'Stripe',
        type: 'stripe',
        isEnabled: true,
        config: {
          apiKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
          secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_...',
          webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_...',
          environment: 'sandbox',
          supportedCurrencies: ['BRL', 'USD', 'EUR', 'GBP'],
          supportedCountries: ['BR', 'US', 'CA', 'GB', 'DE', 'FR']
        },
        fees: {
          percentage: 2.9,
          fixed: 0.30,
          currency: 'USD'
        }
      },

      // PayPal
      {
        id: 'paypal',
        name: 'PayPal',
        type: 'paypal',
        isEnabled: true,
        config: {
          apiKey: process.env.PAYPAL_CLIENT_ID || 'client_id_...',
          secretKey: process.env.PAYPAL_CLIENT_SECRET || 'client_secret_...',
          environment: 'sandbox',
          supportedCurrencies: ['BRL', 'USD', 'EUR', 'GBP'],
          supportedCountries: ['BR', 'US', 'CA', 'GB', 'DE', 'FR']
        },
        fees: {
          percentage: 3.49,
          fixed: 0.49,
          currency: 'USD'
        }
      },

      // Apple Pay
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        type: 'apple_pay',
        isEnabled: true,
        config: {
          environment: 'sandbox',
          supportedCurrencies: ['BRL', 'USD', 'EUR', 'GBP'],
          supportedCountries: ['BR', 'US', 'CA', 'GB', 'DE', 'FR']
        },
        fees: {
          percentage: 0.0, // Apple não cobra taxa adicional
          fixed: 0.0,
          currency: 'USD'
        }
      },

      // Google Pay
      {
        id: 'google_pay',
        name: 'Google Pay',
        type: 'google_pay',
        isEnabled: true,
        config: {
          environment: 'sandbox',
          supportedCurrencies: ['BRL', 'USD', 'EUR', 'GBP'],
          supportedCountries: ['BR', 'US', 'CA', 'GB', 'DE', 'FR']
        },
        fees: {
          percentage: 0.0, // Google não cobra taxa adicional
          fixed: 0.0,
          currency: 'USD'
        }
      },

      // PIX (Brasil)
      {
        id: 'pix',
        name: 'PIX',
        type: 'pix',
        isEnabled: true,
        config: {
          environment: 'production',
          supportedCurrencies: ['BRL'],
          supportedCountries: ['BR']
        },
        fees: {
          percentage: 0.0, // PIX é gratuito
          fixed: 0.0,
          currency: 'BRL'
        }
      }
    ];

    this.providers.push(...providers);
  }

  private initializeIAPProducts() {
    const products: IAPProduct[] = [
      // iOS Products
      {
        id: 'premium_monthly_ios',
        name: 'Premium Mensal',
        description: 'Assinatura premium mensal',
        type: 'subscription',
        platform: 'ios',
        price: {
          amount: 19.90,
          currency: 'BRL',
          localizedPrice: 'R$ 19,90'
        },
        subscriptionGroup: 'premium_subscriptions',
        trialPeriod: 7,
        isActive: true
      },
      {
        id: 'premium_annual_ios',
        name: 'Premium Anual',
        description: 'Assinatura premium anual',
        type: 'subscription',
        platform: 'ios',
        price: {
          amount: 119.90,
          currency: 'BRL',
          localizedPrice: 'R$ 119,90'
        },
        subscriptionGroup: 'premium_subscriptions',
        trialPeriod: 7,
        introductoryPrice: {
          amount: 119.90,
          currency: 'BRL',
          period: 365
        },
        isActive: true
      },
      {
        id: 'premium_lifetime_ios',
        name: 'Premium Lifetime',
        description: 'Acesso vitalício premium',
        type: 'non_consumable',
        platform: 'ios',
        price: {
          amount: 499.90,
          currency: 'BRL',
          localizedPrice: 'R$ 499,90'
        },
        isActive: true
      },

      // Android Products
      {
        id: 'premium_monthly_android',
        name: 'Premium Mensal',
        description: 'Assinatura premium mensal',
        type: 'subscription',
        platform: 'android',
        price: {
          amount: 19.90,
          currency: 'BRL',
          localizedPrice: 'R$ 19,90'
        },
        subscriptionGroup: 'premium_subscriptions',
        trialPeriod: 7,
        isActive: true
      },
      {
        id: 'premium_annual_android',
        name: 'Premium Anual',
        description: 'Assinatura premium anual',
        type: 'subscription',
        platform: 'android',
        price: {
          amount: 119.90,
          currency: 'BRL',
          localizedPrice: 'R$ 119,90'
        },
        subscriptionGroup: 'premium_subscriptions',
        trialPeriod: 7,
        introductoryPrice: {
          amount: 119.90,
          currency: 'BRL',
          period: 365
        },
        isActive: true
      },
      {
        id: 'premium_lifetime_android',
        name: 'Premium Lifetime',
        description: 'Acesso vitalício premium',
        type: 'non_consumable',
        platform: 'android',
        price: {
          amount: 499.90,
          currency: 'BRL',
          localizedPrice: 'R$ 499,90'
        },
        isActive: true
      }
    ];

    this.iapProducts.push(...products);
  }

  // Obter provedores de pagamento disponíveis
  public getAvailableProviders(): PaymentProvider[] {
    return this.providers.filter(p => p.isEnabled);
  }

  // Obter provedor por ID
  public getProviderById(providerId: string): PaymentProvider | undefined {
    return this.providers.find(p => p.id === providerId);
  }

  // Obter provedores por tipo
  public getProvidersByType(type: string): PaymentProvider[] {
    return this.providers.filter(p => p.type === type && p.isEnabled);
  }

  // Obter métodos de pagamento do usuário
  public getUserPaymentMethods(userId: string): PaymentMethod[] {
    return this.paymentMethods.get(userId) || [];
  }

  // Adicionar método de pagamento
  public addPaymentMethod(
    userId: string,
    paymentMethod: Omit<PaymentMethod, 'id' | 'isVerified'>
  ): PaymentMethod | null {
    const userMethods = this.paymentMethods.get(userId) || [];
    
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      ...paymentMethod,
      isVerified: false
    };

    userMethods.push(newMethod);
    this.paymentMethods.set(userId, userMethods);

    return newMethod;
  }

  // Remover método de pagamento
  public removePaymentMethod(userId: string, methodId: string): boolean {
    const userMethods = this.paymentMethods.get(userId) || [];
    const filteredMethods = userMethods.filter(m => m.id !== methodId);
    
    if (filteredMethods.length !== userMethods.length) {
      this.paymentMethods.set(userId, filteredMethods);
      return true;
    }
    
    return false;
  }

  // Definir método padrão
  public setDefaultPaymentMethod(userId: string, methodId: string): boolean {
    const userMethods = this.paymentMethods.get(userId) || [];
    
    userMethods.forEach(method => {
      method.isDefault = method.id === methodId;
    });

    this.paymentMethods.set(userId, userMethods);
    return true;
  }

  // Criar intent de pagamento
  public createPaymentIntent(
    userId: string,
    amount: number,
    currency: string,
    paymentMethodId: string,
    description: string,
    metadata: any
  ): PaymentIntent | null {
    const userMethods = this.getUserPaymentMethods(userId);
    const paymentMethod = userMethods.find(m => m.id === paymentMethodId);
    
    if (!paymentMethod) return null;

    const paymentIntent: PaymentIntent = {
      id: `pi_${Date.now()}`,
      amount,
      currency,
      status: 'pending',
      paymentMethodId,
      description,
      metadata: {
        userId,
        ...metadata
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.paymentIntents.push(paymentIntent);
    return paymentIntent;
  }

  // Processar pagamento
  public async processPayment(paymentIntentId: string): Promise<boolean> {
    const paymentIntent = this.paymentIntents.find(pi => pi.id === paymentIntentId);
    if (!paymentIntent) return false;

    try {
      // Simular processamento de pagamento
      paymentIntent.status = 'processing';
      paymentIntent.updatedAt = Date.now();

      // Aguardar processamento (simulado)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular sucesso (90% de chance)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        paymentIntent.status = 'succeeded';
        paymentIntent.updatedAt = Date.now();
        return true;
      } else {
        paymentIntent.status = 'failed';
        paymentIntent.errorMessage = 'Pagamento recusado pelo banco';
        paymentIntent.updatedAt = Date.now();
        return false;
      }
    } catch (error) {
      paymentIntent.status = 'failed';
      paymentIntent.errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      paymentIntent.updatedAt = Date.now();
      return false;
    }
  }

  // Criar assinatura de pagamento
  public createSubscriptionPayment(
    subscriptionId: string,
    userId: string,
    planId: string,
    amount: number,
    currency: string,
    billingCycle: 'monthly' | 'annual' | 'lifetime',
    paymentMethodId: string,
    platform: 'ios' | 'android' | 'web'
  ): SubscriptionPayment | null {
    const subscriptionPayment: SubscriptionPayment = {
      id: `sub_pay_${Date.now()}`,
      subscriptionId,
      amount,
      currency,
      status: 'pending',
      paymentMethodId,
      billingCycle,
      nextBillingDate: this.calculateNextBillingDate(billingCycle),
      retryCount: 0,
      maxRetries: 3,
      metadata: {
        userId,
        planId,
        platform
      }
    };

    this.subscriptions.push(subscriptionPayment);
    return subscriptionPayment;
  }

  // Calcular próxima data de cobrança
  private calculateNextBillingDate(billingCycle: string): number {
    const now = Date.now();
    
    switch (billingCycle) {
      case 'monthly':
        return now + (30 * 24 * 60 * 60 * 1000);
      case 'annual':
        return now + (365 * 24 * 60 * 60 * 1000);
      case 'lifetime':
        return now + (100 * 365 * 24 * 60 * 60 * 1000); // 100 anos
      default:
        return now + (30 * 24 * 60 * 60 * 1000);
    }
  }

  // Processar cobrança de assinatura
  public async processSubscriptionPayment(subscriptionId: string): Promise<boolean> {
    const subscription = this.subscriptions.find(s => s.subscriptionId === subscriptionId);
    if (!subscription) return false;

    try {
      subscription.status = 'processing';
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simular sucesso (95% de chance)
      const isSuccess = Math.random() > 0.05;
      
      if (isSuccess) {
        subscription.status = 'succeeded';
        subscription.nextBillingDate = this.calculateNextBillingDate(subscription.billingCycle);
        return true;
      } else {
        subscription.status = 'failed';
        subscription.retryCount++;
        
        if (subscription.retryCount >= subscription.maxRetries) {
          // Cancelar assinatura após muitas tentativas
          subscription.status = 'cancelled';
        }
        
        return false;
      }
    } catch (error) {
      subscription.status = 'failed';
      subscription.retryCount++;
      return false;
    }
  }

  // Obter produtos IAP por plataforma
  public getIAPProductsByPlatform(platform: 'ios' | 'android'): IAPProduct[] {
    return this.iapProducts.filter(p => p.platform === platform && p.isActive);
  }

  // Obter produto IAP por ID
  public getIAPProductById(productId: string): IAPProduct | undefined {
    return this.iapProducts.find(p => p.id === productId);
  }

  // Registrar transação IAP
  public registerIAPTransaction(
    productId: string,
    userId: string,
    platform: 'ios' | 'android',
    receiptData?: string,
    transactionId?: string
  ): IAPTransaction | null {
    const product = this.getIAPProductById(productId);
    if (!product) return null;

    const transaction: IAPTransaction = {
      id: `iap_${Date.now()}`,
      productId,
      userId,
      platform,
      status: 'pending',
      receiptData,
      transactionId,
      purchaseDate: Date.now(),
      expirationDate: product.type === 'subscription' ? 
        Date.now() + (30 * 24 * 60 * 60 * 1000) : undefined,
      metadata: {
        isTrialPeriod: false,
        isIntroductoryPrice: false
      }
    };

    this.iapTransactions.push(transaction);
    return transaction;
  }

  // Verificar transação IAP
  public async verifyIAPTransaction(transactionId: string): Promise<boolean> {
    const transaction = this.iapTransactions.find(t => t.id === transactionId);
    if (!transaction) return false;

    try {
      // Simular verificação com Apple/Google
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular sucesso (98% de chance)
      const isVerified = Math.random() > 0.02;
      
      if (isVerified) {
        transaction.status = 'completed';
        return true;
      } else {
        transaction.status = 'failed';
        return false;
      }
    } catch (error) {
      transaction.status = 'failed';
      return false;
    }
  }

  // Obter transações IAP do usuário
  public getUserIAPTransactions(userId: string): IAPTransaction[] {
    return this.iapTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => b.purchaseDate - a.purchaseDate);
  }

  // Obter estatísticas de pagamentos
  public getPaymentStats(): {
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    totalRevenue: number;
    averagePaymentAmount: number;
    paymentMethodsDistribution: { [key: string]: number };
    platformDistribution: { [key: string]: number };
  } {
    const totalPayments = this.paymentIntents.length;
    const successfulPayments = this.paymentIntents.filter(p => p.status === 'succeeded').length;
    const failedPayments = this.paymentIntents.filter(p => p.status === 'failed').length;
    
    const totalRevenue = this.paymentIntents
      .filter(p => p.status === 'succeeded')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const averagePaymentAmount = successfulPayments > 0 ? 
      totalRevenue / successfulPayments : 0;

    // Distribuição por método de pagamento
    const methodDistribution: { [key: string]: number } = {};
    this.paymentIntents.forEach(payment => {
      const method = this.paymentMethods.get(payment.metadata.userId)?.find(m => m.id === payment.paymentMethodId);
      if (method) {
        methodDistribution[method.type] = (methodDistribution[method.type] || 0) + 1;
      }
    });

    // Distribuição por plataforma
    const platformDistribution: { [key: string]: number } = {};
    this.iapTransactions.forEach(transaction => {
      platformDistribution[transaction.platform] = (platformDistribution[transaction.platform] || 0) + 1;
    });

    return {
      totalPayments,
      successfulPayments,
      failedPayments,
      totalRevenue,
      averagePaymentAmount: Math.round(averagePaymentAmount * 100) / 100,
      paymentMethodsDistribution: methodDistribution,
      platformDistribution
    };
  }

  // Obter histórico de pagamentos do usuário
  public getUserPaymentHistory(userId: string): {
    payments: PaymentIntent[];
    subscriptions: SubscriptionPayment[];
    iapTransactions: IAPTransaction[];
  } {
    const payments = this.paymentIntents.filter(p => p.metadata.userId === userId);
    const subscriptions = this.subscriptions.filter(s => s.metadata.userId === userId);
    const iapTransactions = this.iapTransactions.filter(t => t.userId === userId);

    return {
      payments: payments.sort((a, b) => b.createdAt - a.createdAt),
      subscriptions: subscriptions.sort((a, b) => b.nextBillingDate - a.nextBillingDate),
      iapTransactions: iapTransactions.sort((a, b) => b.purchaseDate - a.purchaseDate)
    };
  }
}

export function createPaymentManager(): PaymentManager {
  return new PaymentManager();
}