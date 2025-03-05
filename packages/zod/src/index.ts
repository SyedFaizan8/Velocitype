import * as z from 'zod';

interface DataType {
    password: string;
    confirmPassword: string;
}

export const fullnameSchema = z.object({
    fullname: z.string().min(3, 'at least 3 characters'),
});

export const usernameSchema = z.object({
    username: z.string().min(3, 'at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, "remove special character")
});

export const emailSchema = z.object({
    email: z.string().email('Invalid email'),
});

export const bioSchema = z.object({
    bio: z.string().nonempty('Bio is required').max(80, 'Bio max 80 characters')
});

export const socialSchema = z.object({
    website: z.string().url("Invalid URL"),
});

export const updatePasswordSchema = z.object({
    oldPassword: z.string().min(6, 'at least 6 characters'),
    newPassword: z.string().min(6, 'at least 6 characters'),
});

export const dpSchema = z.object({
    imageId: z.string()
});

export const registerSchema = z.object({
    fullname: fullnameSchema.shape.fullname,
    username: usernameSchema.shape.username,
    email: emailSchema.shape.email,
    password: z.string().min(6, 'at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data: DataType) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
});

export const loginSchema = z.object({
    email: emailSchema.shape.email,
    password: z.string().min(6, 'at least 6 characters'),
});

export const resultSchema = z.object({
    wpm: z.number(),
    accuracy: z.number(),
    totalChars: z.number(),
    totalWords: z.number(),
    timer: z.union([z.literal(15), z.literal(60)]),
})

export const resetPassword = z.object({
    token: z.string(),
    password: z.string().min(6, 'at least 6 characters'),
    confirmPassword: z.string()
}).refine((data: DataType) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ['confirmPassword']
})

export const resetPasswordFrontend = z.object({
    password: z.string().min(6, 'at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data: DataType) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
})