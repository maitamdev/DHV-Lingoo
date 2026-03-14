export type TaskType = 'lesson' | 'practice' | 'review' | 'flashcard' | 'quiz';

export interface StudyTask {
  id: string;
  title: string;
  type: TaskType;
  duration: number;
  xp: number;
  completed: boolean;
  scheduledFor: string;
}

export interface DailyPlan {
  date: string;
  tasks: StudyTask[];
  totalXp: number;
  completedXp: number;
  completionRate: number;
}

export interface WeeklyGoal {
  targetXp: number;
  earnedXp: number;
  daysActive: number;
  streakMaintained: boolean;
}