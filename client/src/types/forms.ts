import { FormErrors } from './auth';
export {};

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?:string;
  lastName?:string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: FormErrors;
  touched: Record<string, boolean>;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  pattern?: RegExp;
  message: string;
}

export interface ValidationRules {
  [field: string]: ValidationRule[];
}