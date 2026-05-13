import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GlassNotification } from '@/components/GlassNotification';

/** Hook pour afficher une GlassNotification facilement */
export function useGlassNotification() {
  const [current, setCurrent] = useState<string | null>(null);

  const show = (message: string) => setCurrent(message);
  const dismiss = () => setCurrent(null);

  const node = (
    <AnimatePresence>
      {current && (
        <GlassNotification
          key={current}
          message={current}
          onDismiss={dismiss}
        />
      )}
    </AnimatePresence>
  );

  return { show, node };
}
