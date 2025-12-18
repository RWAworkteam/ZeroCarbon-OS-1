// API Configuration
export const API_CONFIG = {
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
};

// API Response Types
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp?: number;
}

export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

// Request Options
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
}

