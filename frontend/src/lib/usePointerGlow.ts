import { useEffect, useRef } from 'react';

interface PointerGlowStatus {
  x: number;
  y: number;
  xp: number;
  yp: number;
}


export const usePointerGlow = (): PointerGlowStatus | null => {
  const statusRef = useRef<PointerGlowStatus | null>(null);

  useEffect(() => {
    let frame = 0;
    const handlePointer = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const x = e.clientX;
        const y = e.clientY;
        const xp = x / window.innerWidth;
        const yp = y / window.innerHeight;
        document.documentElement.style.setProperty('--x', x.toFixed(2));
        document.documentElement.style.setProperty('--y', y.toFixed(2));
        document.documentElement.style.setProperty('--xp', xp.toFixed(3));
        document.documentElement.style.setProperty('--yp', yp.toFixed(3));
        document.documentElement.style.setProperty('--hue', (210 + xp * 120).toFixed(2));
        statusRef.current = { x, y, xp, yp };
      });
    };

    window.addEventListener('pointermove', handlePointer, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);


  return statusRef.current;
};

export default usePointerGlow;
