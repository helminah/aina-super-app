import { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useBaby } from '@/contexts/BabyContext';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { AppLayout } from '@/components/layout/AppLayout';
import { SplashScreen } from '@/components/SplashScreen';
import { QuickSettings } from '@/components/QuickSettings';
import { AIChatAssistant } from '@/components/AIChatAssistant';
import { SupabaseSyncBridge } from '@/components/SupabaseSyncBridge';
import { IntroGuide } from '@/components/IntroGuide';

const AuthPage        = lazy(() => import('@/pages/AuthPage').then(m => ({ default: m.AuthPage })));
const DashboardPage   = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const HealthPage      = lazy(() => import('@/pages/HealthPage').then(m => ({ default: m.HealthPage })));
const HealthReportPage= lazy(() => import('@/pages/HealthReportPage').then(m => ({ default: m.HealthReportPage })));
const NutritionPage   = lazy(() => import('@/pages/NutritionPage').then(m => ({ default: m.NutritionPage })));
const JournalPage     = lazy(() => import('@/pages/JournalPage').then(m => ({ default: m.JournalPage })));
const ProfilePage     = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const RecipeDetailPage= lazy(() => import('@/pages/RecipeDetailPage').then(m => ({ default: m.RecipeDetailPage })));
const DoctorPage      = lazy(() => import('@/pages/DoctorPage').then(m => ({ default: m.DoctorPage })));
const CarePage        = lazy(() => import('@/pages/CarePage').then(m => ({ default: m.CarePage })));
const AboutPage       = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));

// Affiché une seule fois par session (cold open)
const SPLASH_FLAG = 'aina-splash-shown';
const INTRO_FLAG = 'aina-intro-done';

export default function App() {
  const { profile, babies } = useBaby();
  const { user, loading } = useAuth();
  const [introDone, setIntroDone] = useState(() => {
    try { return localStorage.getItem(INTRO_FLAG) === '1'; } catch { return true; }
  });
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
      {!introDone && (
        <IntroGuide onDone={() => {
          localStorage.setItem(INTRO_FLAG, '1');
          setIntroDone(true);
        }} />
      )}
      <Suspense fallback={<div className="min-h-dvh bg-ivory-100" />}>
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
      </Suspense>
      <QuickSettings />
      <AIChatAssistant />
      <SupabaseSyncBridge />
    </>
  );
}
