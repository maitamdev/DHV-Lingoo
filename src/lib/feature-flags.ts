export const FEATURES={AI_CHAT:true,PUSH_NOTIFICATIONS:true,FLASHCARDS:false,PRACTICE_MODE:false,DARK_MODE:false} as const;
export function isFeatureEnabled(f:keyof typeof FEATURES){return FEATURES[f]??false}
