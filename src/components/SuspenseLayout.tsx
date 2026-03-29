import { Suspense } from 'react';
import { LoadingPage } from './LoadingPage';

export const SuspenseLayout = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingPage />}>
    {children}
  </Suspense>
);
