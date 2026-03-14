export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  level: string;
  category: string;
  total_lessons: number;
  is_published: boolean;
  created_at: string;
}

export interface CourseWithProgress extends Course {
  completedLessons: number;
  progressPercent: number;
}