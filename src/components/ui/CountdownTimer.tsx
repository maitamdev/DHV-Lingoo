'use client';
import { useState, useEffect } from 'react';

interface Props {
  targetDate: Date;
  onComplete?: () => void;
}

export default function CountdownTimer({ targetDate, onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('00:00:00'); onComplete?.(); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft([h, m, s].map(v => String(v).padStart(2, '0')).join(':'));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  return <span className='font-mono font-bold text-gray-700'>{timeLeft}</span>;
}