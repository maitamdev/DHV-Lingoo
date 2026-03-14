\"use client\";

import { useState, useMemo } from \"react\";
import { CalendarDays, Check, Clock, Zap, BookOpen, Brain, Headphones, PenLine, Trophy } from \"lucide-react\";
import \"./planner.css\";

interface StudyTask {
  id: string;
  title: string;
  type: \"lesson\" | \"practice\" | \"review\" | \"flashcard\";
  duration: number;
  xp: number;
  completed: boolean;
}

const DAILY_TASKS: StudyTask[] = [
  { id: \"t1\", title: \"Hoc bai moi\", type: \"lesson\", duration: 15, xp: 25, completed: false },
  { id: \"t2\", title: \"Luyen tap tu vung\", type: \"practice\", duration: 10, xp: 15, completed: false },
  { id: \"t3\", title: \"On tap flashcard\", type: \"flashcard\", duration: 5, xp: 10, completed: false },
  { id: \"t4\", title: \"Luyen nghe\", type: \"practice\", duration: 10, xp: 20, completed: false },
  { id: \"t5\", title: \"Dien tu vao cho trong\", type: \"practice\", duration: 10, xp: 15, completed: false },
  { id: \"t6\", title: \"On tap bai cu\", type: \"review\", duration: 10, xp: 10, completed: false },
];

const WEEK_DAYS = [\"CN\", \"T2\", \"T3\", \"T4\", \"T5\", \"T6\", \"T7\"];

const taskIcons = {
  lesson: BookOpen,
  practice: Brain,
  review: PenLine,
  flashcard: Headphones,
};

export default function PlannerClient() {
  const [tasks, setTasks] = useState(DAILY_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalXp = tasks.filter((t) => t.completed).reduce((s, t) => s + t.xp, 0);
  const totalDuration = tasks.filter((t) => t.completed).reduce((s, t) => s + t.duration, 0);
  const progress = Math.round((completedCount / tasks.length) * 100);

  const today = new Date();
  const weekDays = useMemo(() => {
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return {
        name: WEEK_DAYS[i],
        num: d.getDate(),
        isToday: d.toDateString() === today.toDateString(),
        isPast: d < today && d.toDateString() !== today.toDateString(),
      };
    });
  }, []);

  return (
    <div className=\"p-4 lg:p-6 max-w-3xl mx-auto\">
      <div className=\"pl-header\">
        <div className=\"relative z-10\">
          <div className=\"flex items-center gap-3 mb-2\">
            <CalendarDays className=\"w-6 h-6\" />
            <h1 className=\"text-2xl font-bold\">Ke hoach hom nay</h1>
          </div>
          <p className=\"text-sm opacity-80\">Hoan thanh cac nhiem vu de nhan XP</p>
          <div className=\"flex items-center gap-4 mt-3\">
            <span className=\"text-sm flex items-center gap-1\"><Check className=\"w-4 h-4\" /> {completedCount}/{tasks.length}</span>
            <span className=\"text-sm flex items-center gap-1\"><Zap className=\"w-4 h-4\" /> {totalXp} XP</span>
            <span className=\"text-sm flex items-center gap-1\"><Clock className=\"w-4 h-4\" /> {totalDuration} phut</span>
          </div>
          <div className=\"mt-3 h-2 bg-white/20 rounded-full overflow-hidden\">
            <div className=\"h-full bg-white rounded-full transition-all\" style={{ width: progress + \"%\" }} />
          </div>
        </div>
      </div>

      <div className=\"pl-week-grid\">
        {weekDays.map((d) => (
          <div key={d.name} className={\"pl-day-card\" + (d.isToday ? \" today\" : \"\") + (d.isPast ? \" completed\" : \"\")}>
            <div className=\"pl-day-name\">{d.name}</div>
            <div className=\"pl-day-num\">{d.num}</div>
            <div className=\"pl-day-status\">{d.isToday ? \"\\ud83d\\udcaa\" : d.isPast ? \"\\u2705\" : \"\"}</div>
          </div>
        ))}
      </div>

      <h2 className=\"text-sm font-bold text-gray-900 mb-3 flex items-center gap-2\">
        <Trophy className=\"w-4 h-4 text-cyan-500\" /> Nhiem vu hom nay
      </h2>

      <div className=\"pl-task-list\">
        {tasks.map((t) => {
          const Icon = taskIcons[t.type];
          return (
            <div key={t.id} className={\"pl-task\" + (t.completed ? \" done\" : \"\")}>
              <div
                className={\"pl-task-check\" + (t.completed ? \" checked\" : \"\")}
                onClick={() => toggleTask(t.id)}
              >
                {t.completed && <Check className=\"w-3 h-3 text-white\" />}
              </div>
              <Icon className=\"w-4 h-4 text-gray-400 flex-shrink-0\" />
              <div>
                <div className={\"pl-task-title\" + (t.completed ? \" line-through\" : \"\")}>{t.title}</div>
                <div className=\"pl-task-time\">{t.duration} phut</div>
              </div>
              <div className=\"pl-task-xp\">+{t.xp} XP</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}