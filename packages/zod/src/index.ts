import * as z from 'zod';

export const usernameSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
});

export const emailSchema = z.object({
    email: z.string().email('Invalid email'),
});

export const registerSchema = z.object({
    fullname: z.string().min(3, 'Full name must be at least 3 characters'),
    username: usernameSchema.shape.username,
    email: emailSchema.shape.email,
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
});

export const loginSchema = z.object({
    email: emailSchema.shape.email,
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
