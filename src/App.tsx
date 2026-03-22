import { Routes, Route, Navigate } from 'react-router-dom';
import { useBaby } from '@/contexts/BabyContext';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { HealthPage } from '@/pages/HealthPage';
import { NutritionPage } from '@/pages/NutritionPage';
import { JournalPage } from '@/pages/JournalPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RecipeDetailPage } from '@/pages/RecipeDetailPage';
import { DoctorPage } from '@/pages/DoctorPage';

export default function App() {
  const { profile } = useBaby();

  if (!profile) {
    return <OnboardingFlow />;
  }

  return (
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
