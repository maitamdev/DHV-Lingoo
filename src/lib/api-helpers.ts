/**
 * API request helpers
 */
export async function fetchApi<T>(url: string, options?: RequestInit): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      return { data: null, error: err.error || 'HTTP ' + res.status };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Network error' };
  }
}

export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => k + '=' + encodeURIComponent(String(v))).join('&');
}