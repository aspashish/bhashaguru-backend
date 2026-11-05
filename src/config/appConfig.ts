/**
 * BhashaGuru Central Production & Development Configuration
 * 
 * PRODUCTION BACKEND CONFIGURATION:
 * RENDER_BACKEND_URL = *****
 * 
 * Paste your deployed Render service URL into the placeholder above or set VITE_RENDER_BACKEND_URL.
 * Example: https://bhashaguru-backend.onrender.com
 */

export const RENDER_BACKEND_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RENDER_BACKEND_URL) ||
  'https://bhashaguru-backend.onrender.com';

/**
 * Determines whether the app is executing inside a native Capacitor Android container.
 */
export function isNativeAndroidApp(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as any;
  if (win.Capacitor?.isNativePlatform?.()) return true;
  if (window.location.protocol === 'capacitor:') return true;
  if (window.location.protocol === 'https:' && window.location.hostname === 'localhost' && !window.location.port) {
    return true;
  }
  return false;
}

/**
 * Returns the active API base URL for network operations:
 * - On native Android: routes requests to the remote production Render backend.
 * - In local development / web preview: uses '' (relative paths handled by Vite/Express proxy).
 * - Can be overridden at build or runtime via VITE_RENDER_BACKEND_URL.
 */
export function getApiBaseUrl(): string {
  // If explicitly specified in Vite environment variables
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RENDER_BACKEND_URL) {
    return import.meta.env.VITE_RENDER_BACKEND_URL.replace(/\/+$/, '');
  }

  // Inside native Android application, always use the remote production Render backend
  if (isNativeAndroidApp()) {
    return RENDER_BACKEND_URL.replace(/\/+$/, '');
  }

  // Local development / web environment uses relative root
  return '';
}

/**
 * Formats a relative API route into an absolute URL if needed by the current runtime.
 * Example: buildApiUrl('/api/ai/tts') -> 'https://bhashaguru-backend.onrender.com/api/ai/tts' on Android
 */
export function buildApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${cleanPath}` : cleanPath;
}

/**
 * Returns the WebSocket URL for Gemini Live real-time audio conversations.
 * Automatically switches to secure wss: on production Render backend or native Android.
 */
export function getLiveWsUrl(): string {
  const base = getApiBaseUrl();
  if (base) {
    const wsBase = base.replace(/^http:/i, 'ws:').replace(/^https:/i, 'wss:');
    return `${wsBase}/api/live`;
  }

  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/api/live`;
  }

  return 'ws://localhost:3000/api/live';
}
