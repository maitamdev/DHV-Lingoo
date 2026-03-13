// Cookie consent utility
export function hasConsent() { return localStorage.getItem('cookie_consent') === 'true'; }
export function setConsent() { localStorage.setItem('cookie_consent', 'true'); }
// GDPR compliance tracking
