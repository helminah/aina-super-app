import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface SplashScreenProps {
  onComplete: () => void;
  minDurationMs?: number;
}

export function SplashScreen({ onComplete, minDurationMs = 2600 }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), minDurationMs);
    return () => clearTimeout(t);
  }, [minDurationMs]);

  // Portail vers body pour échapper au #root { max-width: 480px; overflow: hidden }
  return createPortal(
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] brand-mesh animate-gradient grain overflow-hidden flex items-center justify-center"
        >
          {/* Blobs lumineux en fond */}
          <motion.div
            className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/20 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 40, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-20 -right-16 w-96 h-96 rounded-full bg-amber-200/25 blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative flex flex-col items-center">
            {/* Halo pulsé */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 rounded-full bg-white/30 blur-2xl animate-halo"
              />
              <motion.div
                initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 animate-breathe"
              >
                <img
                  src="/aina-logo.png"
                  alt="AINA"
                  className="w-36 h-36 drop-shadow-xl"
                  style={{ borderRadius: '28%' }}
                />
              </motion.div>
            </div>

            {/* Wordmark */}
            <motion.h1
              initial={{ opacity: 0, y: 16, letterSpacing: '0.4em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.2em' }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-white text-6xl tracking-widest"
              style={{ fontFamily: 'Instrument Serif, serif' }}
            >
              AINA
            </motion.h1>

            {/* Séparateur respirant */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 h-px w-24 bg-white/70 origin-center"
            />

            {/* Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 text-white/90 text-base tracking-wide"
              style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}
            >
              Souffle de vie
            </motion.p>
          </div>

          {/* Indicateur de chargement minimaliste bas */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5"
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/80"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
