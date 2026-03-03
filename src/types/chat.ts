// Chat and AI related types

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface ChatSession {
    id: string;
    messages: ChatMessage[];
    created_at: Date;
}
