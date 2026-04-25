import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, ExternalLink, Instagram, Youtube, Linkedin, Music2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DR_HELMINAH_LINKS, type DrHelminahLinkKey } from '@/config/drhelminah';

/**
 * AboutPage — présentation Dr Helminah + liens depuis config/drhelminah.ts.
 * Les liens vides (chaîne "") sont masqués automatiquement.
 */

type SocialKey = Exclude<DrHelminahLinkKey, 'website' | 'email' | 'calendly'>;

const LINK_META: Record<SocialKey, { Icon: LucideIcon; gradient: string }> = {
  instagram: { Icon: Instagram, gradient: 'from-rose-500 via-fuchsia-500 to-orange-400' },
  tiktok:    { Icon: Music2,    gradient: 'from-bark-800 via-sky-400 to-rose-400' },
  youtube:   { Icon: Youtube,   gradient: 'from-red-600 to-red-500' },
  linkedin:  { Icon: Linkedin,  gradient: 'from-sky-700 to-sky-500' },
};

export function AboutPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const visibleSocials = (Object.keys(LINK_META) as Array<keyof typeof LINK_META>)
    .filter(k => DR_HELMINAH_LINKS[k])
    .map(k => ({ key: k, href: DR_HELMINAH_LINKS[k] as string, ...LINK_META[k] }));

  return (
    <div className="pb-24 safe-top min-h-full bg-ivory-100">
      <div className="relative mesh-violet grain overflow-hidden pt-10 pb-16 px-5">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
          aria-label={t('common.back')}
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 hero-text mt-6 flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/40 shadow-xl mb-4">
            <img src="/helminah.png" alt="Dr Helminah" className="w-full h-full object-cover object-top" />
          </div>
          <h1 className="font-display font-semibold text-white text-5xl leading-[0.95]">
            Dr Helminah
          </h1>
          <p className="text-white/90 text-sm mt-2 font-medium">{t('about.subtitle')}</p>
        </motion.div>
      </div>

      <div className="px-5 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="bg-white rounded-2xl p-5 elev-3"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-violet-600 font-semibold mb-2">
            {t('about.title')}
          </p>
          <p className="text-sm text-bark-700 leading-relaxed">{t('about.bio')}</p>
        </motion.div>

        {visibleSocials.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-bark-500 font-semibold mb-3 px-1">
              {t('about.links_title')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {visibleSocials.map((s, i) => {
                const { Icon } = s;
                return (
                  <motion.a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${s.gradient} text-white elev-2 active:scale-[0.98] transition-transform`}
                  >
                    <div className="flex items-start justify-between">
                      <Icon className="w-7 h-7" strokeWidth={1.8} />
                      <ExternalLink className="w-3.5 h-3.5 text-white/70" />
                    </div>
                    <p className="font-heading font-bold mt-3 text-sm">{t(`about.${s.key}`)}</p>
                    <p className="text-[11px] text-white/80 truncate mt-0.5">{s.href.replace('https://', '').replace('http://', '')}</p>
                  </motion.a>
                );
              })}
            </div>
          </div>
        )}

        {DR_HELMINAH_LINKS.website && (
          <motion.a
            href={DR_HELMINAH_LINKS.website}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-5 w-full py-4 rounded-full bg-violet-500 text-white font-heading font-bold text-base flex items-center justify-center gap-2 elev-brand"
          >
            <Globe className="w-4 h-4" /> {DR_HELMINAH_LINKS.website.replace('https://', '').replace('http://', '')}
          </motion.a>
        )}

        <p className="text-[11px] text-bark-400 italic text-center mt-4">
          AINA — {t('app.slogan')}
        </p>
      </div>
    </div>
  );
}
