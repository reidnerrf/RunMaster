import { useEffect, useMemo, useState } from 'react';
import * as Storage from '../Lib/storage';

const ONBOARDING_KEY = 'runmaster_onboarding_done_v1';
const PROFILE_KEY = 'runmaster_profile_info_v1';

export type Objectives = {
  health?: boolean;
  weightLoss?: boolean;
  compete?: boolean;
  explore?: boolean;
  connect?: boolean;
};

export type BasicProfile = {
  heightCm?: number;
  weightKg?: number;
  objectives?: Objectives;
};

export function useOnboarding() {
  const [onboardingDone, setDone] = useState<boolean>(true);
  const [profile, setProfile] = useState<BasicProfile>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const v = await Storage.getItem(ONBOARDING_KEY);
      setDone(v === '1');
      const p = await Storage.getItem(PROFILE_KEY);
      if (p) try { setProfile(JSON.parse(p)); } catch {}
      setHydrated(true);
    })();
  }, []);

  const markDone = async () => { await Storage.setItem(ONBOARDING_KEY, '1'); setDone(true); };
  const saveProfile = async (p: BasicProfile) => { setProfile(p); await Storage.setItem(PROFILE_KEY, JSON.stringify(p)); };

  return useMemo(() => ({ onboardingDone, profile, hydrated, markDone, saveProfile }), [onboardingDone, profile, hydrated]);
}