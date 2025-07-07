import { ApiError } from './auth';
export {};

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export interface ApiEndpoints {
  auth: {
    login: string;
    register: string;
    profile: string;
    logout: string;
  };
}