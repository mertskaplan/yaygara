import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { SetupPage } from '@/pages/SetupPage'
import { GamePage } from '@/pages/GamePage'
import { ScoreboardPage } from '@/pages/ScoreboardPage'
import { preloadTranslations } from '@/lib/i18n';
// Preload all language files on app startup for instant language switching
preloadTranslations();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/setup",
    element: <SetupPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/play",
    element: <GamePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/score",
    element: <ScoreboardPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}