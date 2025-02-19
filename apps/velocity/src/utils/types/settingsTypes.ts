export interface UserProfile {
    imageUrl: string | null;
    fullname: string | null;
    username: string;
    email: string;
    bio: string | null;
    website: string | null;
}

export interface FullnameFormDataType {
    fullname: string;
}

export interface UsernameFormDataType {
    username: string;
}

export interface EmailFormDataType {
    email: string;
}

export interface BioFormDataType {
    bio: string;
}

export interface SocialsFormDataType {
    website: string;
}

export interface UpdatePasswordFormDataType {
    oldPassword: string;
    newPassword: string;
}

export interface ImageUrlType {
    imageUrl: string | URL;
}

export type UserUpdateData =
    | FullnameFormDataType
    | UsernameFormDataType
    | EmailFormDataType
    | BioFormDataType
    | SocialsFormDataType
    | UpdatePasswordFormDataType
    | ImageUrlType

