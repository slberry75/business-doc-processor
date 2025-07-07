import { AxiosError } from 'axios';
import { LoginRequest, RegistrationRequest, AuthenticationResponse, ProfileResponse } from './auth';

// Define the API contract - what each endpoint expects and returns
interface ApiEndpoints {
  AUTH_LOGIN: {
    url: '/api/auth/login';
    method: 'POST';
    request: LoginRequest;
    response: AuthenticationResponse;
  };
  AUTH_REGISTER: {
    url: '/api/auth/register';
    method: 'POST';
    request: RegistrationRequest;
    response: AuthenticationResponse;
  };
  AUTH_PROFILE: {
    url: '/api/auth/profile';
    method: 'GET';
    request: void;
    response: ProfileResponse;
  };
}

// Type magic: Create a union type of all endpoint names
// This creates: 'AUTH_LOGIN' | 'AUTH_REGISTER'
export type EndpointKey = keyof ApiEndpoints;
export type RequiresBody<T extends EndpointKey> =  ApiEndpoints[T]['method'] extends 'GET' ? false : true;

// More type magic: Generic RequestConfig that changes based on endpoint
// T extends EndpointKey means T must be one of our endpoint names
export interface RequestConfig<T extends EndpointKey> {
  endpoint: T;                                    // The endpoint name (like 'AUTH_LOGIN')
  body: RequiresBody<T> extends true ? ApiEndpoints[T]['request'] : never;              // Body type changes based on endpoint!
  headers?: Record<string, string>;               // Optional headers
}

// Generic response type - also changes based on endpoint
export interface ApiResponse<T extends EndpointKey> {
  data: ApiEndpoints[T]['response'];             // Response type changes based on endpoint!
  status: number;
  statusText: string;
}

// Export the actual endpoint data (URLs, methods, etc.)
export const API_ENDPOINTS: ApiEndpoints = {
  AUTH_LOGIN: {
    url: '/api/auth/login',
    method: 'POST',
    request: {} as LoginRequest,        // Type placeholder - not real data
    response: {} as AuthenticationResponse
  },
  AUTH_REGISTER: {
    url: '/api/auth/register',
    method: 'POST',
    request: {} as RegistrationRequest,
    response: {} as AuthenticationResponse
  },
  AUTH_PROFILE: {
    url: '/api/auth/profile',
    method: 'GET',
    request: undefined,
    response: {} as ProfileResponse
  }
};


export type ApiErrorType = 'network' | 'api' | 'validation' | 'unknown';
export class ApiError extends Error {

  constructor(
    public type: ApiErrorType,
    message: string,
    public statusCode?: number,
    public errors?: string[]
  ) {
    super(message);
  }

  static fromAxiosError(error: AxiosError) : ApiError {
    // Axios error types you need to handle:
    // Server responded with error status (4xx, 5xx)
    if (error.response) {
        return new ApiError(
            'api', 
            typeof error.response.data === 'string' ? error.response.data : 'API Error', 
            error.response.status);
    } else if (error.request) {
    // Request made but no response (network issues)
        return new ApiError (
            'network',
            error.message
        );
    } else {
    // Something else happened
        return new ApiError ('unknown', error.message)
    }
  }
}