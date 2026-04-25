import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const SLIDES = [
  {
    emoji: '🌿',
    titleKey: 'intro.slide1_title',
    bodyKey: 'intro.slide1_body',
    bg: 'from-rose-400 via-pink-500 to-violet-500',
  },
  {
    emoji: '🍽️',
    titleKey: 'intro.slide2_title',
    bodyKey: 'intro.slide2_body',
    bg: 'from-amber-400 via-orange-400 to-red-400',
  },
  {
    emoji: '💬',
    titleKey: 'intro.slide3_title',
    bodyKey: 'intro.slide3_body',
    bg: 'from-violet-500 via-purple-500 to-rose-500',
  },
];

interface Props { onDone: () => void; }

export function IntroGuide({ onDone }: Props) {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);

  const next = () => {
    if (idx < SLIDES.length - 1) setIdx(idx + 1);
    else onDone();
  };

  const slide = SLIDES[idx];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/60 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.3 }}
          className={`flex-1 flex flex-col items-center justify-center px-8 bg-gradient-to-br ${slide.bg}`}
        >
          <div className="text-7xl mb-6">{slide.emoji}</div>
          <h2 className="font-display text-white text-3xl font-semibold text-center leading-tight mb-4">
            {t(slide.titleKey)}
          </h2>
          <p className="text-white/90 text-sm text-center leading-relaxed max-w-xs">
            {t(slide.bodyKey)}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="bg-white safe-bottom px-6 pt-5 pb-8 flex flex-col gap-3">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-2">
          {SLIDES.map((_, i) => (
            <div key={i} className={`rounded-full transition-all ${i === idx ? 'w-6 h-2 bg-violet-500' : 'w-2 h-2 bg-ivory-300'}`} />
          ))}
        </div>
        <button
          onClick={next}
          className="w-full py-4 rounded-full bg-violet-500 text-white font-heading font-bold text-base"
        >
          {idx < SLIDES.length - 1 ? t('intro.next') : t('intro.start')}
        </button>
        <button onClick={onDone} className="text-xs text-bark-400 text-center">
          {t('intro.skip')}
        </button>
      </div>
    </div>
  );
}
