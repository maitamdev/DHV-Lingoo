// Utility functions for formatting data

/**
 * Format a number with thousands separator
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('vi-VN');
}

/**
 * Format XP with suffix
 */
export function formatXP(xp: number): string {
    if (xp >= 1000000) return (xp / 1000000).toFixed(1) + 'M XP';
    if (xp >= 1000) return (xp / 1000).toFixed(1) + 'K XP';
    return xp + ' XP';
}

/**
 * Format time duration in minutes/hours
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) return minutes + ' phút';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? hours + 'h ' + mins + 'p' : hours + ' giờ';
}

/**
 * Format date relative to now (e.g., '2 ngày trước')
 */
export function formatRelativeDate(date: Date | string): string {
    const now = new Date();
    const d = typeof date === 'string' ? new Date(date) : date;
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 30) return d.toLocaleDateString('vi-VN');
    if (days > 0) return days + ' ngày trước';
    if (hours > 0) return hours + ' giờ trước';
    if (minutes > 0) return minutes + ' phút trước';
    return 'Vừa xong';
}

/**
 * Format percentage
 */
export function formatPercent(value: number, total: number): string {
    if (total === 0) return '0%';
    return Math.round((value / total) * 100) + '%';
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}
