import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { BabyProvider } from '@/contexts/BabyContext';
import App from './App';
import './index.css';
import './i18n'; // init i18next avant le render

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BabyProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              style: { background: '#fff8fb', border: '1px solid #ffd6ea', color: '#2a1424' },
              className: 'rounded-2xl font-body',
            }}
            richColors
          />
        </BabyProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
