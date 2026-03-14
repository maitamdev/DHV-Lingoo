export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  estimated_time: number;
  is_published: boolean;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number | null;
  xp_earned: number;
  completed_at: string | null;
}