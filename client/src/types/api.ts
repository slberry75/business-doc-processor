import { LoginRequest, RegistrationRequest, AuthenticationResponse } from './auth';

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
}

// Type magic: Create a union type of all endpoint names
// This creates: 'AUTH_LOGIN' | 'AUTH_REGISTER'
type EndpointKey = keyof ApiEndpoints;

// More type magic: Generic RequestConfig that changes based on endpoint
// T extends EndpointKey means T must be one of our endpoint names
export interface RequestConfig<T extends EndpointKey> {
  endpoint: T;                                    // The endpoint name (like 'AUTH_LOGIN')
  body: ApiEndpoints[T]['request'];              // Body type changes based on endpoint!
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
  }
};

// Keep your existing ApiError interface here too
export interface ApiError {
  message: string;
  statusCode?: number;
  type: 'network' | 'api' | 'validation';
  errors?: string[];
}