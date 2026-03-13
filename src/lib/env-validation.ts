export function validateEnv() { const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']; const missing = required.filter(k => !process.env[k]); if (missing.length > 0) { throw new Error('Missing env vars: ' + missing.join(', ')); } }
// Fail-fast validation
