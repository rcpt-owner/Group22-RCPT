// Determine if we are in development mode (Vite sets this at build/runtime)
export const isDevelopment = import.meta.env.MODE === "development";

// Read the dev API base URL from .env (only required in development)
const devApiUrl = import.meta.env.VITE_FIREBASE_API_URL as string | undefined;

// Choose the base URL depending on MODE. In production, use your deployed API URL.
export const apiBaseUrl: string = isDevelopment
  ? (() => {
      // Validate presence during development to fail fast if misconfigured
      if (!devApiUrl) {
        throw new Error(
          "Missing VITE_FIREBASE_API_URL in .env. Create Frontend/.env and set it."
        );
      }
      return devApiUrl;
    })()
  : "https://rcpt-unimelb.web.app/api"; // Example production URL (update to real API)

// Optional helper for building endpoints in a type-safe way
export const api = {
  baseUrl: apiBaseUrl,
  endpoint(path: string): string {
    // Joins baseUrl and path without double slashes
    return `${apiBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  },
};

// Example usage in a component:
// import { api } from "./config";
// fetch(api.endpoint("/health")).then(...)
