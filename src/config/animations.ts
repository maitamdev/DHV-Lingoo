export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  pageTransition: 400,
} as const;

export const EASINGS = {
  easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const STAGGER_DELAY = 50;