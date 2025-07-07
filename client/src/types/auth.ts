export interface User {
    id: string,
    email: string
};

export interface LoginRequest {
    email: string,
    password: string
};

export interface RegistrationRequest extends LoginRequest{
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  acceptTerms?: boolean;
}

export interface AuthenticationResponse {
    token: string,
    user: User
};

export interface AuthenticationContext {
    authenticated: boolean,
    user?: User
    token? :string,
    loading: boolean,

    // will update the AuthenticationContext internally
    Login(request:LoginRequest): Promise<void>;
    Register(request: RegistrationRequest): Promise<void>;
    Logout(): Promise<void>;
}

export interface ApiError {
  message: string;           // User-friendly message to display
  statusCode?: number;       // HTTP status (400, 401, 500, etc.)
  errors?: string[];         // Multiple validation errors
  type?: 'network' | 'api' | 'validation';  // Error category
}

export interface FormErrors {
    [field: string] : string;
}