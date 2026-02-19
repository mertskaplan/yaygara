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
import { LanguageWrapper } from '@/components/LanguageWrapper';
import { RootRedirector } from '@/components/RootRedirector';
import { ThemeManager } from '@/components/ThemeManager';
import { preloadTranslations } from '@/lib/i18n';
import { Suspense, lazy } from 'react';

// Preload all language files on app startup for instant language switching
preloadTranslations();

const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const SetupPage = lazy(() => import('@/pages/SetupPage').then(m => ({ default: m.SetupPage })));
const GamePage = lazy(() => import('@/pages/GamePage').then(m => ({ default: m.GamePage })));
const ScoreboardPage = lazy(() => import('@/pages/ScoreboardPage').then(m => ({ default: m.ScoreboardPage })));

import { fetchDecksManifest, fetchFullDeck } from '@/lib/decks';

// Preload components and decks in the background for instant navigation and offline support
const preloadAssets = () => {
  // Wait for initial render and idle time
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      // Small delay to ensure initial load is completely finished
      setTimeout(async () => {
        // 1. Preload JS Pages
        import('@/pages/SetupPage');
        setTimeout(() => import('@/pages/GamePage'), 1000);
        setTimeout(() => import('@/pages/ScoreboardPage'), 2000);

        // 2. Preload Decks
        try {
          const manifest = await fetchDecksManifest();
          // Preload decks sequentially to avoid network congestion
          manifest.forEach((deck: any, index: number) => {
            setTimeout(() => {
              fetchFullDeck(deck.filename).catch(() => { });
            }, 3000 + (index * 500));
          });
        } catch (e) {
          console.error("Failed to preload decks", e);
        }
      }, 2000);
    });
  }
};

preloadAssets();

const LoadingPage = () => (
  <div className="flex items-center justify-center h-screen-dvh bg-transparent">
    <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const SuspenseLayout = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingPage />}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirector />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang",
    element: <SuspenseLayout><LanguageWrapper><HomePage /></LanguageWrapper></SuspenseLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang/setup",
    element: <SuspenseLayout><LanguageWrapper><SetupPage /></LanguageWrapper></SuspenseLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang/kurulum",
    element: <SuspenseLayout><LanguageWrapper><SetupPage /></LanguageWrapper></SuspenseLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang/play",
    element: <SuspenseLayout><LanguageWrapper><GamePage /></LanguageWrapper></SuspenseLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang/oyun",
    element: <SuspenseLayout><LanguageWrapper><GamePage /></LanguageWrapper></SuspenseLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang/score",
    element: <SuspenseLayout><LanguageWrapper><ScoreboardPage /></LanguageWrapper></SuspenseLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:lang/skor",
    element: <SuspenseLayout><LanguageWrapper><ScoreboardPage /></LanguageWrapper></SuspenseLayout>,
    errorElement: <RouteErrorBoundary />,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});
import { LazyMotion, domAnimation } from 'framer-motion';

// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeManager>
        <LazyMotion features={domAnimation}>
          <RouterProvider
            router={router}
            future={{
              v7_startTransition: true,
            }}
          />
        </LazyMotion>
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