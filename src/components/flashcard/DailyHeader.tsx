// Header section for daily flashcards page
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
    <div className="daily-header">
      <div style={{ fontSize: 40, marginBottom: 8 }}>🎴</div>
      <h1>Daily Flashcards</h1>
      <p>{formattedDate}</p>
      <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 8 }}>
        Open 5 mystery bags to discover today&apos;s vocabulary
      </p>
    </div>
  );
}
