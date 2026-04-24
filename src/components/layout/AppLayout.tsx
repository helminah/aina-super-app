import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useTranslation } from 'react-i18next';

export function AppLayout() {
  const { t } = useTranslation();

  return (
    <div className="h-[100dvh] flex flex-col bg-ivory-100">
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <Outlet />

        {/* Disclaimer médical global — visible en fin de scroll de chaque page */}
        <p className="px-6 pb-6 pt-2 text-[10px] text-bark-400 italic text-center leading-relaxed max-w-md mx-auto print:hidden">
          {t('app.medical_disclaimer')}
        </p>
      </main>
      <BottomNav />
    </div>
  );
}
