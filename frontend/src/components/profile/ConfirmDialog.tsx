import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, title, description, confirmLabel='Delete', cancelLabel='Cancel', onConfirm, onCancel }) => {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel, onConfirm]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-slate-950/60"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="relative w-full max-w-md rounded-2xl border border-red-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.75)]"
          >
            <h2 className="text-xl font-semibold mb-2 tracking-tight text-red-300">{title}</h2>
            <p className="text-slate-400 leading-relaxed mb-6 text-sm">{description}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800/70 border border-slate-600/60 hover:border-slate-400/50 text-slate-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600/80 hover:bg-red-500/90 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_8px_30px_-8px_rgba(248,113,113,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
