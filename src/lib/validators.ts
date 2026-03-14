// Form validation utility functions

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate password strength (min 6 chars)
 */
export function isValidPassword(password: string): { valid: boolean; message: string } {
    if (password.length < 6) {
        return { valid: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
    }
    if (password.length < 8) {
        return { valid: true, message: 'Mật khẩu yếu - nên dùng 8+ ký tự' };
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return { valid: true, message: 'Mật khẩu trung bình - thêm chữ hoa và số' };
    }
    return { valid: true, message: 'Mật khẩu mạnh' };
}

/**
 * Validate full name
 */
export function isValidName(name: string): boolean {
    return name.trim().length >= 2;
}

/**
 * Sanitize user input (prevent XSS)
 */
export function sanitize(input: string): string {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}
// Email URL phone check
// Input sanitization
// Achievement input validation
// validateAnswer: normalizes and compares user answers
