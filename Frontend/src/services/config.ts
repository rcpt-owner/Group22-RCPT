// Barebones API config — always use localhost:8080 for local development.

// Base URL is hardcoded to the local backend.
// For production, replace this string with your deployed API URL (e.g. 'https://api.myapp.com')
// or swap to an environment-based value during the build/deploy step.
export const BASE_URL = 'http://localhost:8080';

// Minimal API helper object used for fetching
export const api = {
  baseUrl: BASE_URL,
  // Build a full endpoint URL from a relative path (avoids double slashes).
  endpoint(path: string): string {
    const cleanBase = BASE_URL.replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '');
    return `${cleanBase}/${cleanPath}`;
  },
};

// Common headers for JSON APIs
export const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// Notes for production
// - Replace BASE_URL with your production API host (and HTTPS).
// - Consider using environment variables injected at build time for flexibility.
// - Ensure CORS and appropriate auth/security (tokens, HTTPS) are configured on the server.
