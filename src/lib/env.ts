/**
 * Utility to access environment variables.
 * In a Dockerized production environment, these are injected into window.__APP_ENV__
 * via an entrypoint script. During local development, we fall back to Vite's import.meta.env.
 */
export const getEnv = (key: string): string | undefined => {
  // Check runtime injected variables first
  if (typeof window !== 'undefined' && (window as any).__APP_ENV__) {
    const runtimeVal = (window as any).__APP_ENV__[key];
    if (runtimeVal !== undefined && runtimeVal !== '') {
      return runtimeVal;
    }
  }

  // Fallback to Vite build-time variables for local development
  return import.meta.env[`VITE_${key}`];
};

export const isTelemetryEnabled = (): boolean => {
  const enabled = getEnv('TELEMETRY_ENABLED');
  return enabled === 'true' || enabled === '1';
};

export const getTelemetryUrl = (): string => {
  return getEnv('TELEMETRY_URL') || '';
};
