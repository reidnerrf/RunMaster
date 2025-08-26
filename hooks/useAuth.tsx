import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Storage from '../Lib/storage';
import { iapPurchase } from '../Lib/iap';
import { applyReferralCode, validateIapReceipt } from '../Lib/api';

export type User = {
	id: string;
	name: string;
	email: string;
	isPremium: boolean;
	trialStartedAt?: number;
	referralCode?: string;
};

type AuthContextValue = {
	user: User | null;
	loading: boolean;
	isFree: boolean;
	isPremium: boolean;
	login: (email: string, password: string) => Promise<void>;
	signup: (name: string, email: string, password: string) => Promise<void>;
	socialLogin: (provider: 'google' | 'apple' | 'facebook') => Promise<void>;
	logout: () => Promise<void>;
	upgradeToPremium: () => Promise<void>;
	downgradeToFree: () => Promise<void>;
	startTrial: () => Promise<void>;
	applyReferral: (code: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'runmaster_auth_v1';

const isTrialActive = (u: User | null) => {
	if (!u?.trialStartedAt) return false;
	const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
	return Date.now() - u.trialStartedAt < sevenDaysMs;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try {
				const raw = await Storage.getItem(STORAGE_KEY);
				if (raw) {
					const parsed = JSON.parse(raw) as User;
					setUser(parsed);
				}
			} catch (e) {
				// noop
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const persist = async (u: User | null) => {
		if (u) await Storage.setItem(STORAGE_KEY, JSON.stringify(u));
		else await Storage.removeItem(STORAGE_KEY);
	};

	const login = useCallback(async (email: string, password: string) => {
		const mockUser: User = { id: 'u1', name: 'Runner', email, isPremium: false };
		setUser(mockUser);
		await persist(mockUser);
	}, []);

	const signup = useCallback(async (name: string, email: string, password: string) => {
		const mockUser: User = { id: 'u1', name, email, isPremium: false };
		setUser(mockUser);
		await persist(mockUser);
	}, []);

	const socialLogin = useCallback(async (provider: 'google' | 'apple' | 'facebook') => {
		const mockUser: User = { id: provider + '_1', name: provider.toUpperCase() + ' Runner', email: provider + '@example.com', isPremium: false };
		setUser(mockUser);
		await persist(mockUser);
	}, []);

	const logout = useCallback(async () => {
		setUser(null);
		await persist(null);
	}, []);

	const upgradeToPremium = useCallback(async () => {
		if (!user) return;
		// Attempt IAP purchase and validate on backend
		const purchase = await iapPurchase('premium_monthly');
		if (!purchase.success || !purchase.receipt) {
			Alert.alert('Compra falhou', 'Tente novamente mais tarde.');
			return;
		}
		try {
			const validation = await validateIapReceipt(user.id, purchase.receipt, purchase.productId);
			if (!validation.ok || !validation.isPremium) throw new Error('invalid');
			const upgraded = { ...user, isPremium: true };
			setUser(upgraded);
			await persist(upgraded);
			Alert.alert('Premium Ativado', 'Você agora é Premium! Recursos desbloqueados.');
		} catch (e) {
			Alert.alert('Validação falhou', 'Não foi possível validar a assinatura.');
		}
	}, [user]);

	const startTrial = useCallback(async () => {
		if (!user) return;
		if (isTrialActive(user)) {
			Alert.alert('Teste ativo', 'Seu teste gratuito já está ativo.');
			return;
		}
		const updated = { ...user, trialStartedAt: Date.now() } as User;
		setUser(updated);
		await persist(updated);
		Alert.alert('Teste iniciado', 'Você tem 7 dias de Premium grátis.');
	}, [user]);

	const applyReferral = useCallback(async (code: string) => {
		if (!user) return;
		try {
			const resp = await applyReferralCode(user.id, code);
			if (!resp.ok) throw new Error('failed');
			const updated = { ...user, referralCode: code } as User;
			setUser(updated);
			await persist(updated);
			Alert.alert('Referral aplicado', 'Código aplicado com sucesso.');
		} catch (e) {
			Alert.alert('Falha no referral', 'Não foi possível aplicar o código.');
		}
	}, [user]);

	const downgradeToFree = useCallback(async () => {
		if (!user) return;
		const downgraded = { ...user, isPremium: false };
		setUser(downgraded);
		await persist(downgraded);
	}, [user]);

	const premiumActive = !!user?.isPremium || isTrialActive(user);

	const value = useMemo<AuthContextValue>(() => ({
		user,
		loading,
		isFree: !premiumActive,
		isPremium: premiumActive,
		login,
		signup,
		socialLogin,
		logout,
		upgradeToPremium,
		downgradeToFree,
		startTrial,
		applyReferral,
	}), [user, loading, premiumActive, login, signup, socialLogin, logout, upgradeToPremium, downgradeToFree, startTrial, applyReferral]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
};