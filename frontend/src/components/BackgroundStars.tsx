import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface BackgroundStarsProps {
  count?: number;
  areaClassName?: string;
  variant?: 'default' | 'subtle';
  blur?: boolean;
}

export const BackgroundStars: React.FC<BackgroundStarsProps> = ({ count = 25, areaClassName = 'absolute inset-0', variant = 'default', blur = false }) => {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 5 + Math.random() * 3,
      yOffset: 24 + Math.random() * 32,
      scale: 0.85 + Math.random() * 0.5,
      opacity: 0.25 + Math.random() * 0.55
    }));
  }, [count]);

  const baseColor = variant === 'subtle' ? 'bg-white/60' : 'bg-white';

  return (
    <div className={areaClassName} aria-hidden>
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className={`pointer-events-none w-1 h-1 rounded-full ${baseColor} ${blur ? 'blur-[1px]' : ''}`}
          style={{ left: `${s.left}%`, top: `${s.top}%`, position: 'absolute' }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            y: [0, -s.yOffset, 0],
            opacity: [0, s.opacity, s.opacity * 0.5],
            scale: [s.scale, s.scale * 1.15, s.scale],
          }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

export default BackgroundStars;
