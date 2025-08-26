import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces
export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'stripe' | 'paypal' | 'apple_pay' | 'google_pay' | 'pix' | 'bank_transfer' | 'credit_card' | 'debit_card';
  name: string;
  isDefault: boolean;
  isActive: boolean;
  metadata: {
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    country?: string;
    bankName?: string;
    accountType?: string;
    pixKey?: string;
    pixKeyType?: 'email' | 'phone' | 'cpf' | 'cnpj' | 'random';
  };
  security: {
    isVerified: boolean;
    verificationMethod?: 'sms' | 'email' | '3d_secure' | 'biometric';
    verificationStatus: 'pending' | 'verified' | 'failed' | 'expired';
  };
  limits: {
    daily: number;
    monthly: number;
    yearly: number;
    currency: string;
  };
  usage: {
    totalTransactions: number;
    totalAmount: number;
    lastUsed: string;
    successRate: number; // %
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  paymentMethodId: string;
  type: 'subscription' | 'one_time' | 'refund' | 'chargeback' | 'transfer';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'disputed';
  amount: number;
  currency: string;
  description: string;
  metadata: {
    orderId?: string;
    subscriptionId?: string;
    productId?: string;
    quantity?: number;
    unitPrice?: number;
    discount?: number;
    tax?: number;
    fees?: number;
    netAmount?: number;
  };
  gateway: {
    provider: 'stripe' | 'paypal' | 'apple_pay' | 'google_pay' | 'pix' | 'bank';
    transactionId: string;
    authorizationCode?: string;
    gatewayResponse?: any;
    processingTime?: number; // segundos
  };
  timeline: {
    created: string;
    authorized?: string;
    captured?: string;
    settled?: string;
    failed?: string;
    refunded?: string;
    disputed?: string;
  };
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  refunds?: Array<{
    id: string;
    amount: number;
    reason: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
  }>;
  disputes?: Array<{
    id: string;
    reason: string;
    status: 'open' | 'under_review' | 'won' | 'lost';
    amount: number;
    evidence?: string[];
    createdAt: string;
    resolvedAt?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  planType: 'monthly' | 'yearly' | 'lifetime';
  status: 'active' | 'cancelled' | 'expired' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriod: {
    start: string;
    end: string;
    daysRemaining: number;
  };
  billing: {
    amount: number;
    currency: string;
    interval: 'month' | 'year' | 'lifetime';
    nextBillingDate?: string;
    lastBillingDate?: string;
    trialEndsAt?: string;
    isTrial: boolean;
    daysInTrial: number;
  };
  paymentMethod: {
    id: string;
    type: PaymentMethod['type'];
    last4?: string;
    brand?: string;
  };
  features: Array<{
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    usage?: {
      current: number;
      limit: number;
      resetDate: string;
    };
  }>;
  history: Array<{
    date: string;
    action: 'created' | 'renewed' | 'cancelled' | 'reactivated' | 'upgraded' | 'downgraded';
    amount: number;
    currency: string;
    description: string;
  }>;
  autoRenew: boolean;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  type: 'subscription' | 'one_time' | 'usage_based';
  pricing: {
    amount: number;
    currency: string;
    interval?: 'month' | 'year' | 'lifetime';
    trialDays?: number;
    setupFee?: number;
    overageRate?: number;
  };
  features: Array<{
    id: string;
    name: string;
    description: string;
    isIncluded: boolean;
    limit?: number;
    unit?: string;
  }>;
  restrictions: {
    maxUsers?: number;
    maxStorage?: number;
    maxApiCalls?: number;
    customLimits?: Record<string, number>;
  };
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInvoice {
  id: string;
  userId: string;
  subscriptionId?: string;
  number: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  amount: number;
  currency: string;
  dueDate: string;
  paidAt?: string;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    tax?: number;
    discount?: number;
  }>;
  totals: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    amountPaid: number;
    amountDue: number;
  };
  customer: {
    name: string;
    email: string;
    address?: string;
    taxId?: string;
  };
  paymentMethod?: {
    id: string;
    type: PaymentMethod['type'];
    last4?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentWebhook {
  id: string;
  provider: 'stripe' | 'paypal' | 'apple_pay' | 'google_pay' | 'pix';
  event: string;
  eventId: string;
  status: 'pending' | 'processed' | 'failed' | 'retried';
  payload: any;
  headers: Record<string, string>;
  attempts: number;
  maxAttempts: number;
  nextRetryAt?: string;
  processedAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStats {
  totalTransactions: number;
  totalRevenue: number;
  totalRefunds: number;
  totalDisputes: number;
  averageTransactionValue: number;
  conversionRate: number; // %
  refundRate: number; // %
  disputeRate: number; // %
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    transactions: number;
    growth: number; // %
  }>;
  paymentMethodBreakdown: Record<string, {
    transactions: number;
    revenue: number;
    percentage: number; // %
  }>;
  subscriptionMetrics: {
    activeSubscriptions: number;
    monthlyRecurringRevenue: number;
    annualRecurringRevenue: number;
    churnRate: number; // %
    averageLifetimeValue: number;
  };
}

interface PaymentState {
  paymentMethods: PaymentMethod[];
  transactions: PaymentTransaction[];
  subscriptions: Subscription[];
  plans: PaymentPlan[];
  invoices: PaymentInvoice[];
  webhooks: PaymentWebhook[];
  stats: PaymentStats | null;
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  pendingChanges: string[];
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  currentTransaction: PaymentTransaction | null;
  processingPayment: boolean;
}

// Estado inicial
const initialState: PaymentState = {
  paymentMethods: [],
  transactions: [],
  subscriptions: [],
  plans: [],
  invoices: [],
  webhooks: [],
  stats: null,
  isLoading: false,
  error: null,
  lastSync: null,
  pendingChanges: [],
  syncStatus: 'idle',
  currentTransaction: null,
  processingPayment: false,
};

// Thunks assíncronos
export const addPaymentMethod = createAsyncThunk(
  'payment/addMethod',
  async (data: {
    userId: string;
    type: PaymentMethod['type'];
    name: string;
    metadata: PaymentMethod['metadata'];
    isDefault?: boolean;
  }, { rejectWithValue }) => {
    try {
      // Simular adição de método de pagamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const paymentMethod: PaymentMethod = {
        id: `method_${Date.now()}`,
        userId: data.userId,
        type: data.type,
        name: data.name,
        isDefault: data.isDefault || false,
        isActive: true,
        metadata: data.metadata,
        security: {
          isVerified: false,
          verificationStatus: 'pending',
        },
        limits: {
          daily: 10000,
          monthly: 100000,
          yearly: 1000000,
          currency: 'BRL',
        },
        usage: {
          totalTransactions: 0,
          totalAmount: 0,
          lastUsed: new Date().toISOString(),
          successRate: 100,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedMethods = await AsyncStorage.getItem('paymentMethods');
      const methods = savedMethods ? JSON.parse(savedMethods) : [];
      methods.push(paymentMethod);
      await AsyncStorage.setItem('paymentMethods', JSON.stringify(methods));
      
      return paymentMethod;
    } catch (error) {
      return rejectWithValue('Erro ao adicionar método de pagamento');
    }
  }
);

export const processPayment = createAsyncThunk(
  'payment/process',
  async (data: {
    userId: string;
    paymentMethodId: string;
    amount: number;
    currency: string;
    description: string;
    metadata?: Record<string, any>;
    customer: PaymentTransaction['customer'];
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { payment: PaymentState };
      const paymentMethod = state.paymentMethods.find(pm => pm.id === data.paymentMethodId);
      
      if (!paymentMethod) {
        throw new Error('Método de pagamento não encontrado');
      }
      
      if (!paymentMethod.isActive) {
        throw new Error('Método de pagamento não está ativo');
      }
      
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const transaction: PaymentTransaction = {
        id: `txn_${Date.now()}`,
        userId: data.userId,
        paymentMethodId: data.paymentMethodId,
        type: 'one_time',
        status: 'completed',
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        metadata: {
          ...data.metadata,
          netAmount: data.amount,
        },
        gateway: {
          provider: paymentMethod.type === 'pix' ? 'pix' : 'stripe',
          transactionId: `gateway_${Date.now()}`,
          processingTime: 2.5,
        },
        timeline: {
          created: new Date().toISOString(),
          authorized: new Date().toISOString(),
          captured: new Date().toISOString(),
          settled: new Date().toISOString(),
        },
        customer: data.customer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedTransactions = await AsyncStorage.getItem('paymentTransactions');
      const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
      transactions.push(transaction);
      await AsyncStorage.setItem('paymentTransactions', JSON.stringify(transactions));
      
      return transaction;
    } catch (error) {
      return rejectWithValue('Erro ao processar pagamento');
    }
  }
);

export const createSubscription = createAsyncThunk(
  'payment/createSubscription',
  async (data: {
    userId: string;
    planId: string;
    paymentMethodId: string;
    trialDays?: number;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { payment: PaymentState };
      const plan = state.plans.find(p => p.id === data.planId);
      const paymentMethod = state.paymentMethods.find(pm => pm.id === data.paymentMethodId);
      
      if (!plan) {
        throw new Error('Plano não encontrado');
      }
      
      if (!paymentMethod) {
        throw new Error('Método de pagamento não encontrado');
      }
      
      // Simular criação de assinatura
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const now = new Date();
      const trialDays = data.trialDays || plan.pricing.trialDays || 0;
      const trialEndsAt = trialDays > 0 ? new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000) : undefined;
      
      const subscription: Subscription = {
        id: `sub_${Date.now()}`,
        userId: data.userId,
        planId: data.planId,
        planName: plan.name,
        planType: plan.type as Subscription['planType'],
        status: trialDays > 0 ? 'trialing' : 'active',
        currentPeriod: {
          start: now.toISOString(),
          end: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          daysRemaining: 30,
        },
        billing: {
          amount: plan.pricing.amount,
          currency: plan.pricing.currency,
          interval: plan.pricing.interval as Subscription['billing']['interval'],
          nextBillingDate: trialEndsAt || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastBillingDate: now.toISOString(),
          trialEndsAt: trialEndsAt?.toISOString(),
          isTrial: trialDays > 0,
          daysInTrial: trialDays,
        },
        paymentMethod: {
          id: paymentMethod.id,
          type: paymentMethod.type,
          last4: paymentMethod.metadata.last4,
          brand: paymentMethod.metadata.brand,
        },
        features: plan.features.map(f => ({
          ...f,
          isActive: true,
        })),
        history: [{
          date: now.toISOString(),
          action: 'created',
          amount: plan.pricing.amount,
          currency: plan.pricing.currency,
          description: `Assinatura criada - ${plan.name}`,
        }],
        autoRenew: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedSubscriptions = await AsyncStorage.getItem('paymentSubscriptions');
      const subscriptions = savedSubscriptions ? JSON.parse(savedSubscriptions) : [];
      subscriptions.push(subscription);
      await AsyncStorage.setItem('paymentSubscriptions', JSON.stringify(subscriptions));
      
      return subscription;
    } catch (error) {
      return rejectWithValue('Erro ao criar assinatura');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'payment/cancelSubscription',
  async (data: {
    subscriptionId: string;
    reason?: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { payment: PaymentState };
      const subscription = state.subscriptions.find(s => s.id === data.subscriptionId);
      
      if (!subscription) {
        throw new Error('Assinatura não encontrada');
      }
      
      if (subscription.status === 'cancelled') {
        throw new Error('Assinatura já foi cancelada');
      }
      
      const updatedSubscription = {
        ...subscription,
        status: 'cancelled' as const,
        autoRenew: false,
        cancellationReason: data.reason || 'Cancelado pelo usuário',
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Atualiza histórico
      updatedSubscription.history.push({
        date: new Date().toISOString(),
        action: 'cancelled',
        amount: subscription.billing.amount,
        currency: subscription.billing.currency,
        description: 'Assinatura cancelada',
      });
      
      return updatedSubscription;
    } catch (error) {
      return rejectWithValue('Erro ao cancelar assinatura');
    }
  }
);

export const refundTransaction = createAsyncThunk(
  'payment/refund',
  async (data: {
    transactionId: string;
    amount: number;
    reason: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { payment: PaymentState };
      const transaction = state.transactions.find(t => t.id === data.transactionId);
      
      if (!transaction) {
        throw new Error('Transação não encontrada');
      }
      
      if (transaction.status !== 'completed') {
        throw new Error('Transação não pode ser reembolsada');
      }
      
      if (data.amount > transaction.amount) {
        throw new Error('Valor do reembolso não pode ser maior que o valor da transação');
      }
      
      // Simular processamento de reembolso
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const refund = {
        id: `refund_${Date.now()}`,
        amount: data.amount,
        reason: data.reason,
        status: 'completed' as const,
        createdAt: new Date().toISOString(),
      };
      
      const updatedTransaction = {
        ...transaction,
        status: 'refunded' as const,
        refunds: [...(transaction.refunds || []), refund],
        updatedAt: new Date().toISOString(),
      };
      
      return updatedTransaction;
    } catch (error) {
      return rejectWithValue('Erro ao processar reembolso');
    }
  }
);

export const fetchPaymentPlans = createAsyncThunk(
  'payment/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados para demonstração
      const mockPlans: PaymentPlan[] = [
        {
          id: 'plan_1',
          name: 'Plano Básico',
          description: 'Ideal para corredores iniciantes',
          type: 'subscription',
          pricing: {
            amount: 19.90,
            currency: 'BRL',
            interval: 'month',
            trialDays: 7,
          },
          features: [
            { id: 'f1', name: 'Tracking de Treinos', description: 'Registre seus treinos', isIncluded: true },
            { id: 'f2', name: 'Estatísticas Básicas', description: 'Visualize seu progresso', isIncluded: true },
            { id: 'f3', name: 'Comunidade', description: 'Conecte-se com outros corredores', isIncluded: true },
            { id: 'f4', name: 'Treinos Personalizados', description: 'Planos de treino sob medida', isIncluded: false },
            { id: 'f5', name: 'Análise Avançada', description: 'Métricas detalhadas e insights', isIncluded: false },
          ],
          restrictions: {
            maxUsers: 1,
            maxStorage: 100, // MB
            maxApiCalls: 1000,
          },
          isActive: true,
          isPopular: false,
          sortOrder: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: 'plan_2',
          name: 'Plano Premium',
          description: 'Para corredores que querem mais',
          type: 'subscription',
          pricing: {
            amount: 39.90,
            currency: 'BRL',
            interval: 'month',
            trialDays: 14,
          },
          features: [
            { id: 'f1', name: 'Tracking de Treinos', description: 'Registre seus treinos', isIncluded: true },
            { id: 'f2', name: 'Estatísticas Básicas', description: 'Visualize seu progresso', isIncluded: true },
            { id: 'f3', name: 'Comunidade', description: 'Conecte-se com outros corredores', isIncluded: true },
            { id: 'f4', name: 'Treinos Personalizados', description: 'Planos de treino sob medida', isIncluded: true },
            { id: 'f5', name: 'Análise Avançada', description: 'Métricas detalhadas e insights', isIncluded: true },
            { id: 'f6', name: 'Mentoria', description: 'Acesso a mentores especializados', isIncluded: true },
            { id: 'f7', name: 'Eventos Exclusivos', description: 'Participação em eventos especiais', isIncluded: true },
          ],
          restrictions: {
            maxUsers: 3,
            maxStorage: 1000, // MB
            maxApiCalls: 10000,
          },
          isActive: true,
          isPopular: true,
          sortOrder: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ];
      
      return mockPlans;
    } catch (error) {
      return rejectWithValue('Erro ao carregar planos de pagamento');
    }
  }
);

// Slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // Ações síncronas
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setProcessingPayment: (state, action: PayloadAction<boolean>) => {
      state.processingPayment = action.payload;
    },
    
    setCurrentTransaction: (state, action: PayloadAction<PaymentTransaction | null>) => {
      state.currentTransaction = action.payload;
    },
    
    addPendingChange: (state, action: PayloadAction<string>) => {
      if (!state.pendingChanges.includes(action.payload)) {
        state.pendingChanges.push(action.payload);
      }
    },
    
    removePendingChange: (state, action: PayloadAction<string>) => {
      state.pendingChanges = state.pendingChanges.filter(
        change => change !== action.payload
      );
    },
    
    clearPendingChanges: (state) => {
      state.pendingChanges = [];
    },
    
    // Ações para métodos de pagamento
    updatePaymentMethod: (state, action: PayloadAction<{ id: string; updates: Partial<PaymentMethod> }>) => {
      const index = state.paymentMethods.findIndex(pm => pm.id === action.payload.id);
      if (index >= 0) {
        state.paymentMethods[index] = {
          ...state.paymentMethods[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    removePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethods = state.paymentMethods.filter(pm => pm.id !== action.payload);
    },
    
    setDefaultPaymentMethod: (state, action: PayloadAction<string>) => {
      // Remove default de todos os métodos
      state.paymentMethods.forEach(pm => {
        pm.isDefault = false;
        pm.updatedAt = new Date().toISOString();
      });
      
      // Define o novo método como padrão
      const method = state.paymentMethods.find(pm => pm.id === action.payload);
      if (method) {
        method.isDefault = true;
        method.updatedAt = new Date().toISOString();
      }
    },
    
    // Ações para transações
    updateTransaction: (state, action: PayloadAction<{ id: string; updates: Partial<PaymentTransaction> }>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index >= 0) {
        state.transactions[index] = {
          ...state.transactions[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Atualiza transação atual se for a mesma
      if (state.currentTransaction?.id === action.payload.id) {
        state.currentTransaction = {
          ...state.currentTransaction,
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    // Ações para assinaturas
    updateSubscription: (state, action: PayloadAction<{ id: string; updates: Partial<Subscription> }>) => {
      const index = state.subscriptions.findIndex(s => s.id === action.payload.id);
      if (index >= 0) {
        state.subscriptions[index] = {
          ...state.subscriptions[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    // Ações para planos
    updatePlan: (state, action: PayloadAction<{ id: string; updates: Partial<PaymentPlan> }>) => {
      const index = state.plans.findIndex(p => p.id === action.payload.id);
      if (index >= 0) {
        state.plans[index] = {
          ...state.plans[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    // Limpeza de dados antigos
    cleanupOldData: (state, action: PayloadAction<{ maxAge: number }>) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - action.payload.maxAge);
      
      state.transactions = state.transactions.filter(transaction => 
        new Date(transaction.createdAt) > cutoffDate
      );
      
      state.webhooks = state.webhooks.filter(webhook => 
        new Date(webhook.createdAt) > cutoffDate
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // addPaymentMethod
      .addCase(addPaymentMethod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentMethods.push(action.payload);
        state.error = null;
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // processPayment
      .addCase(processPayment.pending, (state) => {
        state.isLoading = true;
        state.processingPayment = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.processingPayment = false;
        state.transactions.push(action.payload);
        state.currentTransaction = action.payload;
        state.error = null;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.processingPayment = false;
        state.error = action.payload as string;
      })
      
      // createSubscription
      .addCase(createSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions.push(action.payload);
        state.error = null;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // cancelSubscription
      .addCase(cancelSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Atualiza assinatura
        const subscriptionIndex = state.subscriptions.findIndex(s => s.id === action.payload.id);
        if (subscriptionIndex >= 0) {
          state.subscriptions[subscriptionIndex] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // refundTransaction
      .addCase(refundTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refundTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Atualiza transação
        const transactionIndex = state.transactions.findIndex(t => t.id === action.payload.id);
        if (transactionIndex >= 0) {
          state.transactions[transactionIndex] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(refundTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // fetchPaymentPlans
      .addCase(fetchPaymentPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
        state.error = null;
      })
      .addCase(fetchPaymentPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Exporta actions e reducer
export const {
  setLoading,
  setError,
  setProcessingPayment,
  setCurrentTransaction,
  addPendingChange,
  removePendingChange,
  clearPendingChanges,
  updatePaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  updateTransaction,
  updateSubscription,
  updatePlan,
  cleanupOldData,
} = paymentSlice.actions;

export default paymentSlice.reducer;