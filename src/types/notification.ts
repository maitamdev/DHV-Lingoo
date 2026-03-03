// Notification related types

export interface PushSubscription {
    id: string;
    user_id: string;
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export interface StudyReminder {
    id: string;
    user_id: string;
    enabled: boolean;
    time: string;
    timezone: string;
}
