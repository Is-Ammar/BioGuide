import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getToastEventName, ToastEventDetail } from '../lib/useToast';

interface ActiveToast extends ToastEventDetail {
  created: number;
  timeout: number;
}

// Renders toasts listening to global events emitted by showToast()
const ToastViewport: React.FC = () => {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<ToastEventDetail>;
      const t: ActiveToast = { ...custom.detail, created: Date.now(), timeout: 5000 };
      setToasts(prev => {
        // If same variant+message already visible, ignore (avoid duplicates like repeated login)
        if (prev.some(p => p.message === t.message && p.variant === t.variant)) return prev;
        return [...prev, t];
      });
      setTimeout(() => dismiss(t.id), t.timeout);
    };
    window.addEventListener(getToastEventName(), handler as EventListener);
    return () => window.removeEventListener(getToastEventName(), handler as EventListener);
  }, []);

  const dismiss = (id: string) => setToasts(ts => ts.filter(t => t.id !== id));

  return (
    <div className="fixed top-20 right-4 z-[200] w-72 sm:w-80 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className={`relative pointer-events-auto overflow-hidden rounded-lg border text-sm shadow-lg px-4 py-3 pr-10 select-none backdrop-blur-md ${
              t.variant === 'success' ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-200' : t.variant === 'error' ? 'bg-red-600/20 border-red-500/40 text-red-200' : 'bg-slate-700/70 border-slate-500/40 text-slate-200'
            }`}
            role="status"
          >
            <span>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="absolute top-2 right-2 text-xs text-slate-300 hover:text-white"
              aria-label="Close notification"
            >
              ×
            </button>
            <motion.span
              className={`absolute bottom-0 left-0 h-0.5 w-full origin-left ${
                t.variant === 'success' ? 'bg-emerald-400' : t.variant === 'error' ? 'bg-red-400' : 'bg-cyan-400'
              }`}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastViewport;
