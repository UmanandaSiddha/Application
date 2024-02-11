import axios from "axios";
import { PersonalResponse } from "@/types/api-types";

export const createPersonal = async (personalData: any) => {
    try {
        const { data }: { data: PersonalResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/personal/new`, personalData, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const viewPersonal = async () => {
    try {
        const { data }: { data: PersonalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/personal/view`, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updatePersonal = async (personalUpdate: any) => {
    try {
        const { data }: { data: PersonalResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/personal/update`, personalUpdate, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const getPersonal = async (id: string) => {
    try {
        const { data }: { data: PersonalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/personal/details/${id}`, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};