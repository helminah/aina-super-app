import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, SunMoon, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import { useTheme, type ThemeMode } from '@/contexts/ThemeContext';

/**
 * QuickSettings — 2 boutons glass en top-right : langue + thème.
 * Portail vers document.body pour échapper au root max-w 480px.
 * Popover compact sur tap.
 */
export function QuickSettings() {
  const [openPanel, setOpenPanel] = useState<'lang' | 'theme' | null>(null);
  const { t, i18n } = useTranslation();
  const { mode: themeMode, setMode: setThemeMode, resolved } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!openPanel) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [openPanel]);

  const currentLang = SUPPORTED_LANGUAGES.find(l => i18n.language.startsWith(l.code)) ?? SUPPORTED_LANGUAGES[0];
  const themeIcon = themeMode === 'auto' ? SunMoon : themeMode === 'dark' ? Moon : Sun;
  const ThemeIconEl = themeIcon;

  return createPortal(
    <div
      ref={rootRef}
      className="fixed z-40 flex gap-2 print:hidden"
      style={{
        top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        right: '12px',
      }}
    >
      {/* Language button */}
      <div className="relative">
        <button
          onClick={() => setOpenPanel(openPanel === 'lang' ? null : 'lang')}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
          style={{
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.35)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
          }}
          aria-label="Language"
        >
          <span className="text-xl drop-shadow-sm">{currentLang.flag}</span>
        </button>

        <AnimatePresence>
          {openPanel === 'lang' && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 top-full mt-2 min-w-[170px] bg-white rounded-2xl elev-3 overflow-hidden"
            >
              <p className="px-3 pt-2.5 pb-1 text-[10px] uppercase tracking-[0.15em] text-bark-400 font-semibold">
                {t('profile.language')}
              </p>
              {SUPPORTED_LANGUAGES.map(lang => {
                const active = i18n.language.startsWith(lang.code);
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setOpenPanel(null);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm font-medium transition-colors ${
                      active ? 'bg-violet-50 text-violet-700' : 'text-bark-700 hover:bg-ivory-100'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="flex-1">{lang.label}</span>
                    {active && <Check className="w-3.5 h-3.5 text-violet-600" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Theme button */}
      <div className="relative">
        <button
          onClick={() => setOpenPanel(openPanel === 'theme' ? null : 'theme')}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
          style={{
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.35)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
          }}
          aria-label="Theme"
        >
          <ThemeIconEl className={`w-5 h-5 ${resolved === 'dark' ? 'text-white' : 'text-bark-700'} drop-shadow-sm`} />
        </button>

        <AnimatePresence>
          {openPanel === 'theme' && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 top-full mt-2 min-w-[170px] bg-white rounded-2xl elev-3 overflow-hidden"
            >
              <p className="px-3 pt-2.5 pb-1 text-[10px] uppercase tracking-[0.15em] text-bark-400 font-semibold">
                {t('profile.theme')}
              </p>
              {([
                { id: 'auto' as ThemeMode,  labelKey: 'theme_auto',  icon: SunMoon },
                { id: 'light' as ThemeMode, labelKey: 'theme_light', icon: Sun },
                { id: 'dark' as ThemeMode,  labelKey: 'theme_dark',  icon: Moon },
              ]).map(opt => {
                const Icon = opt.icon;
                const active = themeMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setThemeMode(opt.id);
                      setOpenPanel(null);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm font-medium transition-colors ${
                      active ? 'bg-violet-50 text-violet-700' : 'text-bark-700 hover:bg-ivory-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1">{t(`profile.${opt.labelKey}`)}</span>
                    {active && <Check className="w-3.5 h-3.5 text-violet-600" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>,
    document.body,
  );
}
