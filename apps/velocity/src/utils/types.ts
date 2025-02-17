import {
    bioSchema,
    emailSchema,
    fullnameSchema,
    loginSchema,
    registerSchema,
    socialSchema,
    updatePasswordSchema,
    usernameSchema
} from "@repo/zod";
import { z } from "zod";

export type FullnameFormData = z.infer<typeof fullnameSchema>;

export type UsernameFormData = z.infer<typeof usernameSchema>;

export type EmailFormData = z.infer<typeof emailSchema>;

export type BioFormData = z.infer<typeof bioSchema>;

export type SocialsFormData = z.infer<typeof socialSchema>;

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;