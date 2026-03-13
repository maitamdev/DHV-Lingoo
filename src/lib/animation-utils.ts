import React from 'react';
export function staggerDelay(index: number, base: number = 50): string { return (index * base) + 'ms'; } export function getStaggerStyle(index: number): React.CSSProperties { return { animationDelay: staggerDelay(index), opacity: 0, animation: 'fadeInUp 0.4s ease-out forwards' }; }

// Reusable easing curves
// Achievement unlock animation
