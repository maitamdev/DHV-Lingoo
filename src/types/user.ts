// User and profile related types

export interface User {
    id: string;
    email: string;
    created_at: string;
}

export interface Profile {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    xp: number;
    streak: number;
    longest_streak: number;
    daily_time: number;
    role: 'student' | 'admin';
    created_at: string;
    updated_at: string;
}
