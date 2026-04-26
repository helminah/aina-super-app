import { ArrowLeft, Heart, Instagram, Youtube, Linkedin, Mail, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DR_HELMINAH_LINKS } from '@/config/drhelminah';

const SOCIALS = [
  { platform: 'Instagram', handle: '@dr.helminah',    href: DR_HELMINAH_LINKS.instagram, icon: Instagram, bg: 'bg-pink-50',  color: 'text-pink-500'  },
  { platform: 'TikTok',    handle: '@dr.helminah',    href: DR_HELMINAH_LINKS.tiktok,    icon: null,       bg: 'bg-gray-50',  color: 'text-bark-800'  },
  { platform: 'YouTube',   handle: '@drhelminah',     href: DR_HELMINAH_LINKS.youtube,   icon: Youtube,    bg: 'bg-red-50',   color: 'text-red-500'   },
  { platform: 'LinkedIn',  handle: 'helminah-rm',          href: DR_HELMINAH_LINKS.linkedin, icon: Linkedin, bg: 'bg-blue-50',   color: 'text-blue-600'  },
  { platform: 'X / Twitter', handle: '@minahrandria',     href: DR_HELMINAH_LINKS.twitter,  icon: Twitter,  bg: 'bg-gray-50',   color: 'text-bark-800'  },
  { platform: 'Email',     handle: 'helminahpro@gmail.com', href: DR_HELMINAH_LINKS.email,  icon: Mail,     bg: 'bg-amber-50',  color: 'text-amber-600' },
];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z"/>
    </svg>
  );
}

export function DoctorPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-[100dvh] bg-ivory-100 safe-top safe-bottom">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label={t('doctor.back')}
          className="w-10 h-10 rounded-full bg-ivory-200 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-bark-800" />
        </button>
        <h1 className="font-heading text-xl font-bold text-bark-800">Dr Helminah</h1>
      </div>

      <div className="px-5 pb-10 space-y-4">
        {/* Photo & identité */}
        <div className="flex flex-col items-center py-4">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-lg mb-4">
            <img src="/helminah.png" alt="Dr Helminah" className="w-full h-full object-cover object-top" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-bark-800 text-center">Dr Helminah Randriamananoro</h2>
          <p className="text-bark-500 text-sm mt-1 text-center">{t('doctor.credentials')}</p>
          <p className="text-bark-400 text-xs mt-0.5 text-center">{t('doctor.university')}</p>
        </div>

        {/* À propos d'AINA */}
        <div className="bg-forest-600 rounded-3xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5" />
            <h3 className="font-heading font-bold">{t('doctor.about_aina_title')}</h3>
          </div>
          <p className="text-sm leading-relaxed opacity-90">
            {t('doctor.about_aina_body')}
          </p>
        </div>

        {/* Réseaux sociaux */}
        <div className="bg-ivory-50 rounded-3xl p-5 ambient-shadow">
          <h3 className="font-heading font-bold text-bark-800 mb-3">{t('doctor.follow_title')}</h3>
          <div className="space-y-2">
            {SOCIALS.map(({ platform, handle, href, icon: Icon, bg, color }) => (
              <a key={platform} href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${bg} active:opacity-70 transition-opacity`}>
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  {Icon ? <Icon className={`w-4 h-4 ${color}`} /> : <TikTokIcon className={`w-4 h-4 ${color}`} />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-bark-800">{platform}</p>
                  <p className="text-xs text-bark-500 truncate">{handle}</p>
                </div>
                <ArrowLeft className="w-4 h-4 text-bark-300 ml-auto rotate-180 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
