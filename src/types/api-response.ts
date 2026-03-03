// API response wrapper type
export type ApiResponse<T> = { success: boolean; data?: T; error?: string; timestamp: string; };
