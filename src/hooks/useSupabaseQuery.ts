'use client';
import { useState, useEffect, useCallback } from 'react';

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useSupabaseQuery<T>(queryFn: () => Promise<{ data: T | null; error: { message: string } | null }>): QueryState<T> & { refetch: () => void } {
  const [state, setState] = useState<QueryState<T>>({ data: null, loading: true, error: null });

  const fetch = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const { data, error } = await queryFn();
      if (error) setState({ data: null, loading: false, error: error.message });
      else setState({ data, loading: false, error: null });
    } catch (e) {
      setState({ data: null, loading: false, error: String(e) });
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { ...state, refetch: fetch };
}