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

export interface ProfileResponse {
    userId: string,
    email: string,
    firstName: string,
    lastName: string
}

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

export interface FormErrors {
    [field: string] : string;
}