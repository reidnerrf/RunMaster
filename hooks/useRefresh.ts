import { useCallback, useState } from 'react';

export function useRefresh<T = any>(loadFn: () => Promise<T>) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await loadFn(); } finally { setRefreshing(false); }
  }, [loadFn]);
  return { refreshing, onRefresh };
}

