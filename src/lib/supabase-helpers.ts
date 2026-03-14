/**
 * Supabase query helper functions
 */
export async function fetchSingle<T>(
  query: { data: T | null; error: { message: string } | null }
): Promise<T | null> {
  if (query.error) {
    console.error('Supabase query error:', query.error.message);
    return null;
  }
  return query.data;
}

export function buildPagination(page: number, pageSize: number): { from: number; to: number } {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { from, to };
}

export function handleSupabaseError(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: string }).message);
  }
  return 'An unexpected error occurred';
}