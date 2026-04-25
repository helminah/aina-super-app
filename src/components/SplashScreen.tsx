import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { AinaLogo } from '@/components/AinaLogo';

interface SplashScreenProps {
  onComplete: () => void;
  minDurationMs?: number;
}

const LETTERS = ['A', 'I', 'N', 'A'];

export function SplashScreen({ onComplete, minDurationMs = 2600 }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), minDurationMs);
    return () => clearTimeout(t);
  }, [minDurationMs]);

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
          {/* Blobs flottants en arrière-plan */}
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
            {/* Cercle logo avec ring rotatif + halo + breathe */}
            <div className="relative w-44 h-44 flex items-center justify-center mb-10">
              {/* Ring conique rotatif — "charge infinie" premium */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                transition={{
                  opacity: { duration: 0.6 },
                  scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  rotate: { duration: 3.5, repeat: Infinity, ease: 'linear' },
                }}
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(255,255,255,0.95) 85%, transparent 100%)',
                  maskImage:
                    'radial-gradient(circle, transparent 58%, black 60%, black 66%, transparent 68%)',
                  WebkitMaskImage:
                    'radial-gradient(circle, transparent 58%, black 60%, black 66%, transparent 68%)',
                }}
              />

              {/* Halo pulsé derrière le logo */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-3 rounded-full bg-white/30 blur-2xl animate-halo"
              />

              {/* Logo breathe + flottement vertical */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
                transition={{
                  scale: { duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.6, delay: 0.1 },
                  y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
                }}
                className="relative z-10 animate-breathe drop-shadow-2xl"
              >
                <AinaLogo size={144} />
              </motion.div>
            </div>

            {/* Wordmark — stagger lettre par lettre (preloader éditorial) */}
            <h1
              className="font-wordmark text-white text-8xl leading-none flex gap-[0.02em]"
              aria-label="AINA"
            >
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.55 + i * 0.09,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            {/* Trait respirant + shimmer */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 h-px w-24 bg-white/70 origin-center relative overflow-hidden"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 1.6 }}
              />
            </motion.div>

            {/* Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
              className="font-display-intimate mt-4 text-white/95 text-xl"
            >
              {t('app.slogan')}
            </motion.p>
          </div>

          {/* Preloader bar minimaliste bas */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-28 h-[2px] rounded-full bg-white/15 overflow-hidden"
          >
            <motion.span
              className="absolute inset-y-0 w-1/3 bg-white/90 rounded-full"
              animate={{ x: ['-120%', '360%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
