import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

export function AppLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Pages with their own FAB — don't stack a second one
  const showFab = pathname !== '/journal' && pathname !== '/';

  return (
    <div className="h-[100dvh] flex flex-col bg-ivory-100">
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <Outlet />
        <p className="px-6 pb-6 pt-2 text-[10px] text-bark-400 italic text-center leading-relaxed max-w-md mx-auto print:hidden">
          {t('app.medical_disclaimer')}
        </p>
      </main>

      {showFab && (
        <button
          aria-label={t('common.add_event_aria')}
          onClick={() => navigate('/journal')}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-forest-600 text-white shadow-xl shadow-forest-600/30 flex items-center justify-center z-30 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      <BottomNav />
    </div>
  );
}
