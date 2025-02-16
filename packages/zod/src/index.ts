import * as z from 'zod';

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
    imageUrl: z.string().url('Invalid URL'),
});

export const registerSchema = z.object({
    fullname: fullnameSchema.shape.fullname,
    username: usernameSchema.shape.username,
    email: emailSchema.shape.email,
    password: z.string().min(6, 'at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
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
    totalWords: z.number()
})

export type FullnameFormData = z.infer<typeof fullnameSchema>;

export type UsernameFormData = z.infer<typeof usernameSchema>;

export type EmailFormData = z.infer<typeof emailSchema>;

export type BioFormData = z.infer<typeof bioSchema>;

export type SocialsFormData = z.infer<typeof socialSchema>;

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;
