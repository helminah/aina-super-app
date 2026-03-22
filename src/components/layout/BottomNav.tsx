import { useLocation, useNavigate } from 'react-router-dom';
import { Home, HeartPulse, UtensilsCrossed, BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { path: '/', label: 'Accueil', icon: Home },
  { path: '/health', label: 'Santé', icon: HeartPulse },
  { path: '/nutrition', label: 'Nutrition', icon: UtensilsCrossed },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/profile', label: 'Profil', icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="glass safe-bottom border-t border-ivory-300/50 px-2 pt-2 pb-2">
      <div className="flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-0.5 py-1 px-3 min-w-[60px]"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-forest-600"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-forest-500' : 'text-bark-400'
                }`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={`text-[10px] font-medium transition-colors ${
                isActive ? 'text-forest-600' : 'text-bark-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
