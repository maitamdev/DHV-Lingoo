'use client';
export function playSound(type: 'success' | 'error' | 'click' | 'levelup'): void {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new AudioContext();
    const freqs: Record<string, number[]> = {
      success: [523, 659, 784],
      error: [330, 262],
      click: [1000],
      levelup: [523, 659, 784, 1047],
    };
    const f = freqs[type] || [440];
    f.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = freq;
      g.gain.value = 0.08;
      o.start(ctx.currentTime + i * 0.12);
      o.stop(ctx.currentTime + i * 0.12 + 0.15);
    });
  } catch(e) { /* audio not supported */ }
}