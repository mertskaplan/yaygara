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
import { ThemeManager } from '@/components/ThemeManager'
import { preloadTranslations } from '@/lib/i18n';
// Preload all language files on app startup for instant language switching
preloadTranslations();
import { LanguageWrapper } from '@/components/LanguageWrapper';
import { RootRedirector } from '@/components/RootRedirector';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirector />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang",
    element: <LanguageWrapper><HomePage /></LanguageWrapper>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang/setup",
    element: <LanguageWrapper><SetupPage /></LanguageWrapper>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang/kurulum",
    element: <LanguageWrapper><SetupPage /></LanguageWrapper>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang/play",
    element: <LanguageWrapper><GamePage /></LanguageWrapper>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang/oyun",
    element: <LanguageWrapper><GamePage /></LanguageWrapper>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang/score",
    element: <LanguageWrapper><ScoreboardPage /></LanguageWrapper>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang/skor",
    element: <LanguageWrapper><ScoreboardPage /></LanguageWrapper>,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeManager>
        <RouterProvider router={router} />
      </ThemeManager>
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