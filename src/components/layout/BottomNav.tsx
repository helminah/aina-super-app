import { useLocation, useNavigate } from 'react-router-dom';
import { Home, HeartPulse, UtensilsCrossed, BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';

// Chaque tab a sa teinte — pill morphing colorée, plus vivant que mono-rose.
const tabs = [
  { path: '/',          label: 'Accueil',   icon: Home,             gradient: 'linear-gradient(135deg, #FF2D78, #FF6030)', shadow: 'rgba(255, 45, 120, 0.5)' },
  { path: '/health',    label: 'Santé',     icon: HeartPulse,       gradient: 'linear-gradient(135deg, #10b981, #34d399)', shadow: 'rgba(16, 185, 129, 0.5)' },
  { path: '/nutrition', label: 'Nutrition', icon: UtensilsCrossed,  gradient: 'linear-gradient(135deg, #f88a1f, #FFA641)', shadow: 'rgba(248, 138, 31, 0.5)' },
  { path: '/journal',   label: 'Journal',   icon: BookOpen,         gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', shadow: 'rgba(14, 165, 233, 0.5)' },
  { path: '/profile',   label: 'Profil',    icon: User,             gradient: 'linear-gradient(135deg, #9333ea, #c084fc)', shadow: 'rgba(147, 51, 234, 0.5)' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = tabs.find(t => t.path === location.pathname) ?? tabs[0];

  return (
    <nav
      className="safe-bottom border-t border-white/60 px-2 pt-2 pb-2"
      style={{
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        background: 'rgba(255, 248, 251, 0.78)',
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
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
