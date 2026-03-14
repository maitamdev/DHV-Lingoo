/**
 * Input validation helpers
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) return { valid: false, message: 'Mat khau phai co it nhat 8 ky tu' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Can it nhat 1 chu hoa' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Can it nhat 1 so' };
  return { valid: true, message: 'Mat khau hop le' };
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>&'"]/g, (char) => {
    const entities: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&#39;', '"': '&quot;' };
    return entities[char] || char;
  });
}