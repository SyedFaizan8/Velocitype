import { z } from 'zod';
import {
    fullnameSchema,
    usernameSchema,
    emailSchema,
    bioSchema,
    socialSchema,
    updatePasswordSchema,
    registerSchema,
    loginSchema
} from '@repo/zod';

export type FullnameFormData = z.infer<typeof fullnameSchema>;

export type UsernameFormData = z.infer<typeof usernameSchema>;

export type EmailFormData = z.infer<typeof emailSchema>;

export type BioFormData = z.infer<typeof bioSchema>;

export type SocialsFormData = z.infer<typeof socialSchema>;

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;
