import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth';
import PremiumGate from '../components/PremiumGate';
import { getRemoteConfig } from '../Lib/api';

export type GateContextValue = {
	isPremium: boolean;
	open: (source?: string) => void;
	close: () => void;
	requirePremium: (action: () => void, source?: string) => () => void;
};

export type FlagsContextValue = {
	flags: Record<string, boolean>;
	variants: Record<string, string>;
	refresh: () => Promise<void>;
};

const GateContext = createContext<GateContextValue | undefined>(undefined);
const FlagsContext = createContext<FlagsContextValue | undefined>(undefined);

export const GateProvider: React.FC<{ children: React.ReactNode; group?: string }> = ({ children, group }) => {
	const { user } = useAuth();
	const [visible, setVisible] = useState(false);
	const [source, setSource] = useState<string | undefined>(undefined);

	const [flags, setFlags] = useState<Record<string, boolean>>({});
	const [variants, setVariants] = useState<Record<string, string>>({});

	const open = useCallback((src?: string) => {
		setSource(src);
		setVisible(true);
	}, []);

	const close = useCallback(() => setVisible(false), []);

	const requirePremium = useCallback((action: () => void, src?: string) => {
		return () => {
			if (user?.isPremium) return action();
			open(src);
		};
	}, [open, user?.isPremium]);

	const value = useMemo<GateContextValue>(() => ({ isPremium: !!user?.isPremium, open, close, requirePremium }), [user?.isPremium, open, close, requirePremium]);

	const refresh = useCallback(async () => {
		try {
			const cfg = await getRemoteConfig(user?.id, group);
			setFlags(cfg.flags || {});
			setVariants(cfg.variants || {});
		} catch {}
	}, [user?.id, group]);

	useEffect(() => { refresh(); }, [refresh]);

	const flagsValue = useMemo<FlagsContextValue>(() => ({ flags, variants, refresh }), [flags, variants, refresh]);

	return (
		<GateContext.Provider value={value}>
			<FlagsContext.Provider value={flagsValue}>
				{children}
				<PremiumGate visible={visible} onClose={close} source={source} />
			</FlagsContext.Provider>
		</GateContext.Provider>
	);
};

export const useGate = () => {
	const ctx = useContext(GateContext);
	if (!ctx) throw new Error('useGate must be used within GateProvider');
	return ctx;
};

export const useFlags = () => {
	const ctx = useContext(FlagsContext);
	if (!ctx) throw new Error('useFlags must be used within GateProvider');
	return ctx;
};