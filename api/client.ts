import { API_CONFIG, ApiResponse, ApiError, RequestOptions } from './config';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Set auth token to localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Build query string from params
const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      queryParams.append(key, String(params[key]));
    }
  });
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Main API client function
export const apiClient = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    method = 'GET',
    headers = {},
    body,
    params,
  } = options;

  // Build full URL
  let url = `${API_CONFIG.baseURL}${endpoint}`;
  if (params && method === 'GET') {
    url += buildQueryString(params);
  }

  // Prepare headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Prepare request config
  const requestConfig: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    requestConfig.body = JSON.stringify(body);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      ...requestConfig,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return {
        code: response.status,
        message: 'Success',
        data: null as T,
      };
    }

    const data: ApiResponse<T> = await response.json();

    // Handle HTTP errors
    if (!response.ok) {
      const error: ApiError = {
        code: response.status,
        message: data.message || `HTTP error! status: ${response.status}`,
        details: data,
      };
      throw error;
    }

    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw {
        code: 408,
        message: 'Request timeout',
        details: error,
      } as ApiError;
    }

    if (error.code) {
      throw error as ApiError;
    }

    throw {
      code: 500,
      message: error.message || 'Network error',
      details: error,
    } as ApiError;
  }
};

// Convenience methods
export const get = <T = any>(endpoint: string, params?: Record<string, any>) => {
  return apiClient<T>(endpoint, { method: 'GET', params });
};

export const post = <T = any>(endpoint: string, body?: any) => {
  return apiClient<T>(endpoint, { method: 'POST', body });
};

export const put = <T = any>(endpoint: string, body?: any) => {
  return apiClient<T>(endpoint, { method: 'PUT', body });
};

export const del = <T = any>(endpoint: string) => {
  return apiClient<T>(endpoint, { method: 'DELETE' });
};

export const patch = <T = any>(endpoint: string, body?: any) => {
  return apiClient<T>(endpoint, { method: 'PATCH', body });
};

