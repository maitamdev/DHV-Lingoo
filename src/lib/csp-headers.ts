// Content Security Policy configuration
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    'default-src ''self''',
    'script-src ''self'' ''unsafe-eval'' ''unsafe-inline''',
    'style-src ''self'' ''unsafe-inline'' fonts.googleapis.com',
    'font-src ''self'' fonts.gstatic.com',
    'img-src ''self'' data: blob:',
    'connect-src ''self'' *.supabase.co wss://*.supabase.co',
  ].join('; '),
};
