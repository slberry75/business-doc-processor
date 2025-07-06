// Base interface with common authentication properties
export interface AuthRequest {
  email: string;
  password: string;
}

// Registration extends base with additional fields
export interface RegisterRequest extends AuthRequest {
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  acceptTerms?: boolean;
}

// Login extends base (could add login-specific fields later)
export interface LoginRequest extends AuthRequest {
  rememberMe?: boolean;
}

// User entity model
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Response DTO
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

// JWT payload structure
export interface TokenPayload {
  userId: string;
  email: string;
}
export interface FullJWTTokenPayload extends TokenPayload {
  iat: 1625097600,         // ← Standard JWT (issued at)
  exp: 1625184000          // ← Standard JWT (expires at)
}