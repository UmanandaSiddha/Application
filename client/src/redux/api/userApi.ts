import axios from "axios";
import { UserResponse } from "../../types/api-types";

export const getUser = async () => {
    try {
        const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/me`, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (loginData: object) => {
    try {
        const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
        const { data }: { data: UserResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, loginData , config);
        return data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (registerData: object) => {
    try {
        const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
        const { data }: { data: UserResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, registerData , config);
        return data;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async () => {
    try {
        const { data }: { data: any } = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/delete/account`, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const requestVerifyUser = async () => {
    try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}/user/request/verification`, { withCredentials: true });
    } catch (error) {
        throw error;
    }
};

export const updateUserProfile = async (updateData: object) => {
    try {
        const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
        const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/me/update`, updateData, config);
        return data;
    } catch (error) {
        throw error;
    }
};

export const verifyUser = async (token: string) => {
    try {
        const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/verify/${token}`, {withCredentials: true});
        return data;
    } catch (error) {
        throw error;
    }
};

export const updatePassword = async (resetData: object) => {
    try {
        const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
        const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/password/update`, resetData, config);
        return data;
    } catch (error) {
        throw error;
    }
};

export const forgotPassword = async (email: object) => {
    try {
        const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
        const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/password/forgot`, email, config);
        return data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (resetPass: object, token: string) => {
    try {
        const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
        const { data }: { data: any } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/password/reset/${token}`, resetPass, config);
        return data;
    } catch (error) {
        throw error;
    }
};



