import * as z from 'zod';


export const fullnameSchema = z.object({
    fullname: z.string().min(3, 'Full name must be at least 3 characters'),
});

export const usernameSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
});

export const emailSchema = z.object({
    email: z.string().email('Invalid email'),
});

export const bioSchema = z.object({
    bio: z.string().max(100, 'Bio must be at most 100 characters').optional()
});

export const socialSchema = z.object({
    website: z.string().url('Invalid URL').optional(),
});

export const updatePasswordSchema = z.object({
    oldPassword: z.string().min(6, 'Old password must be at least 6 characters'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const dpSchema = z.object({
    profilePicture: z.string().url('Invalid URL'),
});

export const registerSchema = z.object({
    fullname: fullnameSchema.shape.fullname,
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
