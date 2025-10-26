// services/api.ts
import { api, defaultHeaders } from './config';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: any
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

// Generic API response handler with improved error handling
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorBody: any;
    const contentType = response.headers.get('content-type');

    try {
      if (contentType && contentType.includes('application/json')) {
        errorBody = await response.json();
      } else {
        errorBody = await response.text();
      }
    } catch {
      errorBody = 'Unable to parse error response';
    }

    throw new ApiError(response.status, response.statusText, errorBody);
  }

  // Handle empty responses (204 No Content, etc.)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  // Parse JSON response
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  // Return text for non-JSON responses
  const text = await response.text();
  return text as any as T;
}

// Generic API request function with retry logic
async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  retries: number = 0
): Promise<T> {
  const url = api.endpoint(path);

// Prepare headers
const headers: Record<string, string> = {
  ...defaultHeaders,
  ...(options.headers as Record<string, string>),
};

// Don't set Content-Type for FormData
if (options.body instanceof FormData) {
  delete headers['Content-Type'];
}


  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    return handleResponse<T>(response);
  } catch (error) {
    // Retry logic for network errors (not for 4xx/5xx responses)
    if (retries > 0 && error instanceof TypeError && error.message.includes('fetch')) {
      console.warn(`Retrying API request to ${path}, ${retries} attempts remaining`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return apiRequest<T>(path, options, retries - 1);
    }

    throw error;
  }
}

// Main API service object with all HTTP methods
export const apiService = {
  // GET request with query parameters
  get: <T>(path: string, params?: Record<string, any>, options?: RequestInit) => {
    const queryString = params
      ? '?' + new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';

    return apiRequest<T>(`${path}${queryString}`, {
      ...options,
      method: 'GET'
    });
  },

  // POST request
  post: <T>(path: string, data?: any, options?: RequestInit) => {
    const body = data instanceof FormData
      ? data
      : data !== undefined
        ? JSON.stringify(data)
        : undefined;

    return apiRequest<T>(path, {
      ...options,
      method: 'POST',
      body
    });
  },

  // PUT request
  put: <T>(path: string, data?: any, options?: RequestInit) => {
    const body = data instanceof FormData
      ? data
      : data !== undefined
        ? JSON.stringify(data)
        : undefined;

    return apiRequest<T>(path, {
      ...options,
      method: 'PUT',
      body
    });
  },

  // PATCH request
  patch: <T>(path: string, data?: any, options?: RequestInit) => {
    const body = data instanceof FormData
      ? data
      : data !== undefined
        ? JSON.stringify(data)
        : undefined;

    return apiRequest<T>(path, {
      ...options,
      method: 'PATCH',
      body
    });
  },

  // DELETE request
  delete: <T = void>(path: string, options?: RequestInit) =>
    apiRequest<T>(path, {
      ...options,
      method: 'DELETE'
    }),

  // Download file (PDF export, etc.)
  download: async (path: string, filename?: string) => {
    const response = await fetch(api.endpoint(path));

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

// Helper function for adding headers
export function withHeaders(headers: Record<string, string>): RequestInit {
  return { headers };
}

// Helper function for adding auth token (for future use)
export function withAuth(token: string): RequestInit {
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-User-Id': 'dev-user-001' // Temporary until auth is implemented
    }
  };
}

// Helper function for user ID header (temporary solution)
export function withUserId(userId: string): RequestInit {
  return {
    headers: {
      'X-User-Id': userId
    }
  };
}