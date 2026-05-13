import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

interface GlassNotificationProps {
  message: string;
  duration?: number;
  onDismiss: () => void;
}

export function GlassNotification({ message, duration = 3000, onDismiss }: GlassNotificationProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);

  return createPortal(
    <div className="fixed bottom-24 inset-x-0 flex justify-center z-[70] px-6 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={onDismiss}
        className="pointer-events-auto max-w-[340px] w-full cursor-pointer"
        style={{
          background: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.4)',
          padding: '14px 18px',
        }}
      >
        <p className="text-sm font-medium text-bark-800 leading-snug text-center"
          style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
          {message}
        </p>
      </motion.div>
    </div>,
    document.body,
  );
}
