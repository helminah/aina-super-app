import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useBaby } from '@/contexts/BabyContext';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { AppLayout } from '@/components/layout/AppLayout';
import { SplashScreen } from '@/components/SplashScreen';
import { QuickSettings } from '@/components/QuickSettings';
import { AIChatAssistant } from '@/components/AIChatAssistant';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { HealthPage } from '@/pages/HealthPage';
import { HealthReportPage } from '@/pages/HealthReportPage';
import { NutritionPage } from '@/pages/NutritionPage';
import { JournalPage } from '@/pages/JournalPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RecipeDetailPage } from '@/pages/RecipeDetailPage';
import { DoctorPage } from '@/pages/DoctorPage';
import { CarePage } from '@/pages/CarePage';
import { AboutPage } from '@/pages/AboutPage';
import { SupabaseSyncBridge } from '@/components/SupabaseSyncBridge';

// Affiché une seule fois par session (cold open)
const SPLASH_FLAG = 'aina-splash-shown';

export default function App() {
  const { profile, babies } = useBaby();
  const { user, loading } = useAuth();
  const [splashDone, setSplashDone] = useState(() => {
    try {
      return sessionStorage.getItem(SPLASH_FLAG) === '1';
    } catch {
      return false;
    }
  });

  const handleSplashComplete = () => {
    try {
      sessionStorage.setItem(SPLASH_FLAG, '1');
    } catch { /* storage peut être bloqué */ }
    setSplashDone(true);
  };

  // Le splash couvre loading et cold open. Il tourne en parallèle de la
  // récupération de session Supabase — quand il finit, si auth est prête, on enchaîne.
  if (!splashDone) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center brand-mesh-soft">
        <div className="w-10 h-10 border-2 border-forest-200 border-t-forest-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthPage />
        <QuickSettings />
      </>
    );
  }

  if (babies.length === 0 || !profile) {
    return (
      <>
        <OnboardingFlow />
        <QuickSettings />
        <SupabaseSyncBridge />
      </>
    );
  }

  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/report" element={<HealthReportPage />} />
        <Route path="/care" element={<CarePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <QuickSettings />
      <AIChatAssistant />
      <SupabaseSyncBridge />
    </>
  );
}
