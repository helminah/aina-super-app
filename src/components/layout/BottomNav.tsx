import { useLocation, useNavigate } from 'react-router-dom';
import { Home, HeartPulse, UtensilsCrossed, BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';

// Chaque tab a sa teinte — pill morphing colorée, plus vivant que mono-rose.
const tabs = [
  { path: '/',          key: 'home',      icon: Home,             gradient: 'linear-gradient(135deg, #D4637A, #D4703A)', shadow: 'rgba(184, 78, 100, 0.4)' },
  { path: '/health',    key: 'health',    icon: HeartPulse,       gradient: 'linear-gradient(135deg, #10b981, #34d399)', shadow: 'rgba(16, 185, 129, 0.5)' },
  { path: '/nutrition', key: 'nutrition', icon: UtensilsCrossed,  gradient: 'linear-gradient(135deg, #f88a1f, #FFA641)', shadow: 'rgba(248, 138, 31, 0.5)' },
  { path: '/journal',   key: 'journal',   icon: BookOpen,         gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', shadow: 'rgba(14, 165, 233, 0.5)' },
  { path: '/profile',   key: 'profile',   icon: User,             gradient: 'linear-gradient(135deg, #9333ea, #c084fc)', shadow: 'rgba(147, 51, 234, 0.5)' },
] as const;

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { resolved } = useTheme();
  const activeTab = tabs.find(t => t.path === location.pathname) ?? tabs[0];

  const navBg = resolved === 'dark'
    ? 'rgba(26, 14, 18, 0.88)'
    : 'rgba(255, 248, 251, 0.78)';
  const navBorder = resolved === 'dark'
    ? '1px solid rgba(255,255,255,0.08)'
    : '1px solid rgba(255,255,255,0.6)';

  return (
    <nav
      className="safe-bottom px-2 pt-2 pb-2"
      style={{
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        background: navBg,
        borderTop: navBorder,
      }}
    >
      <div className="flex items-center justify-around relative">
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={t(`nav.${tab.key}`)}
              className="relative flex flex-col items-center gap-0.5 py-1.5 px-3 min-w-[60px]"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl -z-10"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  style={{
                    background: activeTab.gradient,
                    boxShadow: `0 8px 18px -6px ${activeTab.shadow}`,
                  }}
                />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-bark-400'}`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-white' : 'text-bark-400'}`}>
                {t(`nav.${tab.key}`)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
