// import { IUser } from "@/types/type";
import API from "../../config/apiConfig";
import {
    RegisterUserRequest,
    RegisterUserResponse,
    LoginUserRequest,
    LoginUserResponse,
    VerifyUserRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UpdateBillingInfoRequest,
    UpdatePasswordRequest,
    UpdateProfileRequest,
    UpdateOrganisationDetailsRequest
} from "./user.types";

// 🔹 Register User
export const registerUser = async (userData: RegisterUserRequest): Promise<RegisterUserResponse> => {
    const response = await API.post<RegisterUserResponse>("/user/register", userData);
    return response.data;
};

// 🔹 Request Email Verification
export const requestVerification = async (): Promise<{ success: boolean; message: string }> => {
    const response = await API.get<{ success: boolean; message: string }>("/user/request/verification");
    return response.data;
};

// 🔹 Verify User (OTP)
export const verifyUser = async (data: VerifyUserRequest): Promise<RegisterUserResponse> => {
    const response = await API.put<RegisterUserResponse>("/user/verify", data);
    return response.data;
};

// 🔹 Login User
export const loginUser = async (credentials: LoginUserRequest): Promise<LoginUserResponse> => {
    const response = await API.post<LoginUserResponse>("/user/login", credentials);
    return response.data;
};

// 🔹 Fetch Blocked Users
export const fetchBlockedUsers = async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await API.get<{ success: boolean; data: any }>(`/user/block/${id}`);
    return response.data;
};

// 🔹 Unblock User
export const unblockUser = async (id: string): Promise<{ success: boolean }> => {
    const response = await API.get<{ success: boolean }>(`/user/unblock/${id}`);
    return response.data;
};

// 🔹 Logout User
export const logoutUser = async (): Promise<{ success: boolean; message: string }> => {
    const response = await API.get<{ success: boolean; message: string }>("/user/logout");
    return response.data;
};

// 🔹 Forgot Password
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> => {
    const response = await API.post<{ success: boolean; message: string }>("/user/password/forgot", data);
    return response.data;
};

// 🔹 Reset Password
export const resetPassword = async (token: string, data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> => {
    const response = await API.put<{ success: boolean; message: string }>(`/user/password/reset/${token}`, data);
    return response.data;
};

// 🔹 Update Billing Info
export const updateBillingInfo = async (data: UpdateBillingInfoRequest): Promise<{ success: boolean; user: any }> => {
    const response = await API.put<{ success: boolean; user: any }>("/user/billing/update", data);
    return response.data;
};

// 🔹 Update Password
export const updatePassword = async (data: UpdatePasswordRequest): Promise<{ success: boolean; message: string }> => {
    const response = await API.put<{ success: boolean; message: string }>("/user/password/update", data);
    return response.data;
};

// 🔹 Update User Profile
export const updateProfile = async (data: UpdateProfileRequest): Promise<{ success: boolean; user: any }> => {
    const response = await API.put<{ success: boolean; user: any }>("/user/me/update", data);
    return response.data;
};

// 🔹 Update Organization Details
export const updateOrganisationDetails = async (data: UpdateOrganisationDetailsRequest): Promise<{ success: boolean; user: any }> => {
    const response = await API.put<{ success: boolean; user: any }>("/user/org/update", data);
    return response.data;
};

// 🔹 Delete Account
export const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete<{ success: boolean; message: string }>("/user/delete/account");
    return response.data;
};