// Header section for daily flashcards page - Cyberpunk theme
'use client';

interface DailyHeaderProps {
  date: string;
}

export default function DailyHeader({ date }: DailyHeaderProps) {
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="cyber-header">
      <h1 className="cyber-header-title">DAILY VOCABULARY HUB</h1>
      <div className="cyber-header-status">
        <span className="cyber-status-dot" />
        SYSTEM STATUS: READY
      </div>
      <div className="cyber-header-date">{formattedDate}</div>
    </div>
  );
}
// Vietnamese locale date
