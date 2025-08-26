import { useState, useEffect, useCallback, useRef } from 'react';

interface UseDebounceOptions {
  delay?: number;
  immediate?: boolean;
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Hook personalizado para debounce de valores
 * Útil para buscas, filtros e inputs que precisam de delay
 */
export function useDebounce<T>(
  value: T,
  options: UseDebounceOptions = {}
): T {
  const {
    delay = 300,
    immediate = false,
    maxWait,
    leading = false,
    trailing = true,
  } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastCallTimeRef = useRef<number>(0);
  const lastInvokeTimeRef = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();

    // Se é a primeira chamada e leading é true, executa imediatamente
    if (leading && timeoutRef.current === undefined) {
      setDebouncedValue(value);
      lastInvokeTimeRef.current = now;
      return;
    }

    // Se immediate é true, executa imediatamente
    if (immediate) {
      setDebouncedValue(value);
      lastInvokeTimeRef.current = now;
      return;
    }

    // Limpa o timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Verifica se maxWait foi excedido
    const shouldInvoke = maxWait && (now - lastCallTimeRef.current >= maxWait);

    if (shouldInvoke) {
      setDebouncedValue(value);
      lastInvokeTimeRef.current = now;
    } else {
      // Configura novo timeout
      timeoutRef.current = setTimeout(() => {
        if (trailing) {
          setDebouncedValue(value);
          lastInvokeTimeRef.current = Date.now();
        }
        timeoutRef.current = undefined;
      }, delay);
    }

    lastCallTimeRef.current = now;

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, immediate, maxWait, leading, trailing]);

  return debouncedValue;
}

/**
 * Hook para debounce de função
 * Útil para callbacks que precisam ser debounced
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
  options: {
    maxWait?: number;
    leading?: boolean;
    trailing?: boolean;
  } = {}
): T {
  const { maxWait, leading = false, trailing = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastCallTimeRef = useRef<number>(0);
  const lastInvokeTimeRef = useRef<number>(0);
  const callbackRef = useRef<T>(callback);

  // Atualiza a referência do callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();

      // Se é a primeira chamada e leading é true, executa imediatamente
      if (leading && timeoutRef.current === undefined) {
        callbackRef.current(...args);
        lastInvokeTimeRef.current = now;
        return;
      }

      // Limpa o timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Verifica se maxWait foi excedido
      const shouldInvoke = maxWait && (now - lastCallTimeRef.current >= maxWait);

      if (shouldInvoke) {
        callbackRef.current(...args);
        lastInvokeTimeRef.current = now;
      } else {
        // Configura novo timeout
        timeoutRef.current = setTimeout(() => {
          if (trailing) {
            callbackRef.current(...args);
            lastInvokeTimeRef.current = Date.now();
          }
          timeoutRef.current = undefined;
        }, delay);
      }

      lastCallTimeRef.current = now;
    }) as T,
    [delay, maxWait, leading, trailing]
  );

  // Cleanup function
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Hook para debounce de busca com estado de loading
 */
export function useDebouncedSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  delay: number = 300,
  options: {
    minQueryLength?: number;
    maxResults?: number;
    immediate?: boolean;
  } = {}
) {
  const {
    minQueryLength = 2,
    maxResults = 50,
    immediate = false,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, { delay, immediate });

  // Função de busca debounced
  const performSearch = useDebouncedCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minQueryLength) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const searchResults = await searchFunction(searchQuery);
        setResults(searchResults.slice(0, maxResults));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro na busca');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    delay
  );

  // Executa busca quando query debounced muda
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // Função para limpar busca
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setHasSearched(false);
  }, []);

  // Função para atualizar query
  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  return {
    query,
    debouncedQuery,
    results,
    isLoading,
    error,
    hasSearched,
    updateQuery,
    clearSearch,
    performSearch: () => performSearch(query),
  };
}

/**
 * Hook para debounce de filtros
 */
export function useDebouncedFilters<T>(
  filters: Record<string, any>,
  delay: number = 300
) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(filters);
  const debouncedFilters = useDebounce(activeFilters, { delay });

  const updateFilter = useCallback((key: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    setActiveFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const clearFilter = useCallback((key: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  return {
    activeFilters,
    debouncedFilters,
    updateFilter,
    updateFilters,
    clearFilter,
    clearAllFilters,
  };
}

/**
 * Hook para debounce de scroll
 */
export function useDebouncedScroll(
  delay: number = 100,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = {}
) {
  const { leading = false, trailing = true } = options;
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const debouncedSetScrollPosition = useDebouncedCallback(
    (position: number) => {
      setScrollPosition(position);
      setIsScrolling(false);
    },
    delay,
    { leading, trailing }
  );

  const handleScroll = useCallback((event: any) => {
    const position = event.nativeEvent.contentOffset.y;
    setIsScrolling(true);
    debouncedSetScrollPosition(position);
  }, [debouncedSetScrollPosition]);

  return {
    scrollPosition,
    isScrolling,
    handleScroll,
  };
}