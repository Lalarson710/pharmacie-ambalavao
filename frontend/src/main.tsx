import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
//import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/providers/AuthProvider';
import App from './App.tsx';
import './index.css';
import './features/dashboard/dashboard.css';
// Doit rester après index.css : règles d'impression du ticket de caisse.
import './ticket-caisse.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
