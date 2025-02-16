import { IUser } from "../../types/type";

export interface RegisterUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    website?: string;
    phone?: string;
}

export interface RegisterUserResponse {
    success: boolean;
    token: string;
    user: IUser;
}

export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface LoginUserResponse {
    success: boolean;
    token: string;
    user: IUser;
}

export interface VerifyUserRequest {
    otp: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    newPassword: string;
    confirmPassword: string;
}

export interface UpdateBillingInfoRequest {
    phone?: string;
    street?: string;
    state?: string;
    city?: string;
    postalCode?: string;
    country?: string;
}

export interface UpdatePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export interface UpdateOrganisationDetailsRequest {
    phone?: string;
    website?: string;
    address?: {
        street?: string;
        state?: string;
        city?: string;
        postalCode?: string;
        country?: string;
    };
}