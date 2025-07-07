import axios, { AxiosInstance, AxiosResponse } from 'axios';
import  logger from '../config/logger';
import { ApiError } from '../types/api';
class AuthService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.apiClient.interceptors.request.use(
      (config) => {
        logger.info('API Request', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
        });
        return config;
      },
      (error) => {
        logger.error('Request Error', { error: error.message });
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response: AxiosResponse) => {
        logger.info('API Response', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error) => {
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  // We'll implement this method next
  private handleApiError(error: any): ApiError {
    // Implementation comes in next step
    return {
        message:"test",
        type:"network",
        statusCode:500,
    }
  }

  // We'll implement auth methods here
}

export const authService = new AuthService();