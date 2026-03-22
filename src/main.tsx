import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { BabyProvider } from '@/contexts/BabyContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BabyProvider>
        <App />
      </BabyProvider>
    </BrowserRouter>
  </StrictMode>,
);
