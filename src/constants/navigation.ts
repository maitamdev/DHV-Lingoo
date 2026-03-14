export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

export const DASHBOARD_NAV: NavItem[] = [
  { label: 'Tong quan', href: '/dashboard', icon: 'ðŸ“Š' },
  { label: 'Khoa hoc', href: '/dashboard/courses', icon: 'ðŸ“š' },
  { label: 'Flashcard', href: '/dashboard/flashcards', icon: 'ðŸƒ' },
  { label: 'Luyen tap', href: '/dashboard/practice', icon: 'ðŸ§ ' },
  { label: 'On tap', href: '/dashboard/review', icon: 'ðŸ”„' },
  { label: 'Tu vung', href: '/dashboard/vocabulary', icon: 'ðŸ“' },
  { label: 'Tra tu', href: '/dashboard/dictionary', icon: 'ðŸ“–' },
  { label: 'Chat AI', href: '/dashboard/chat', icon: 'ðŸ¤–' },
  { label: 'Thanh tuu', href: '/dashboard/achievements', icon: 'ðŸ†' },
  { label: 'Xep hang', href: '/dashboard/leaderboard', icon: 'ðŸ¥‡' },
  { label: 'Ke hoach', href: '/dashboard/planner', icon: 'ðŸ“…' },
  { label: 'Lo trinh', href: '/dashboard/roadmap', icon: 'ðŸ—ºï¸' },
  { label: 'Ho so', href: '/dashboard/profile', icon: 'ðŸ‘¤' },
  { label: 'Cai dat', href: '/dashboard/settings', icon: 'âš™ï¸' },
];