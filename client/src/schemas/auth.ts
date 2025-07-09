import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Please provide your password')
})

export const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(12, 'Password must be at least 12 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
    firstName: z
        .string()
        .max(50, 'First name must not exceed 50 characters'),
    lastName: z
        .string()
        .max(50, 'Last name must not exceed 50 characters'),
    acceptTerms: z
        .boolean()
        .refine(val => val === true, 'You must accept the terms and conditions')
}).refine(data => data.password === data.confirmPassword, {
        message: 'Password and confirm password must match',
        path: ['confirmPassword']
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;