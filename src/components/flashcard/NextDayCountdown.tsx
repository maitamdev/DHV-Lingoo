// Countdown timer to next day reset
'use client';

import { useState, useEffect } from 'react';

export default function NextDayCountdown() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${mins}m ${secs}s`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 13, color: '#94a3b8' }}>
      New cards in: <span style={{ fontWeight: 800, color: '#6366f1', fontFamily: 'monospace' }}>{timeLeft}</span>
    </div>
  );
}
// setInterval live update
// Show next topic preview
