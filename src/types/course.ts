// Course and lesson related types

export interface Course {
    id: string;
    title: string;
    description: string;
    level: string;
    thumbnail_url: string | null;
    created_at: string;
}

export interface Lesson {
    id: string;
    course_id: string;
    title: string;
    content: string;
    description: string | null;
    order_index: number;
    created_at: string;
}

export interface Vocabulary {
    id: string;
    lesson_id: string;
    word: string;
    meaning: string;
    phonetic: string | null;
    example: string | null;
    audio_url: string | null;
}

export interface LessonProgress {
    id: string;
    user_id: string;
    lesson_id: string;
    course_id: string;
    completed: boolean;
    score: number;
    xp_earned: number;
    completed_at: string;
}
