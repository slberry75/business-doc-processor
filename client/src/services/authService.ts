import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import  logger from '../config/logger';
import { API_ENDPOINTS, ApiError, ApiResponse, EndpointKey, RequestConfig } from '../types/api';
import { LoginRequest, RegistrationRequest } from '../types/auth';
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

  public async login(credentials: LoginRequest) {
    const config: RequestConfig<'AUTH_LOGIN'> = {
        endpoint : 'AUTH_LOGIN',
        body : credentials
    };
    return this.makeRequest(config);
  }

  public async register(registration:RegistrationRequest) {
    const config: RequestConfig<'AUTH_REGISTER'> = {
        endpoint: 'AUTH_REGISTER',
        body: registration
    };
    return this.makeRequest(config);
  }

  public async getProfile() {
    const config: RequestConfig<'AUTH_PROFILE'> = {
        endpoint: 'AUTH_PROFILE',
        body: undefined as never
    };
    return this.makeRequest(config);
  }

  private async makeRequest<T extends EndpointKey>(config: RequestConfig<T>) : Promise<ApiResponse<T>> {
    const endpoint = API_ENDPOINTS[config.endpoint as keyof typeof API_ENDPOINTS];
    try {
        
        switch(endpoint.method) {
            case 'GET':
                return await this.apiClient.get(endpoint.url)
            case 'POST':
                return await this.apiClient.post(endpoint.url, config.body);
        }
    } catch (error: unknown) {
        throw this.handleApiError(error);
    }
  }

  private handleApiError(error: any): ApiError {
    if (error instanceof AxiosError) {
        return ApiError.fromAxiosError(error);
    }  else {
        return new ApiError(
            'unknown', 
            error instanceof Error ? error.message : 'An unexpected error has occured.'); 
    }  
  }

}

export const authService = new AuthService();