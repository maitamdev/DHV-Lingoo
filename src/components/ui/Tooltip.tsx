'use client';
import { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom';
}

export default function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false);
  const posStyle = position === 'top'
    ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 }
    : { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6 };

  return (
    <div className='relative inline-block' onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div
          className='absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap'
          style={posStyle}
        >
          {content}
        </div>
      )}
    </div>
  );
}