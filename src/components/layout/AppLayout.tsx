import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  return (
    <div className="h-[100dvh] flex flex-col bg-ivory-100">
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
