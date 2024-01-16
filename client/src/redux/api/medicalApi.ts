import axios from "axios";
import { MedicalResponse } from "@/types/api-types";

export const createMedical = async (medicalData: any) => {
    try {
        const { data }: { data: MedicalResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/medical/new`, medicalData, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const viewMedical = async () => {
    try {
        const { data }: { data: MedicalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/medical/view`, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateMedical = async (personalUpdate: any, id: string) => {
    try {
        const { data }: { data: MedicalResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/medical/update/${id}`, personalUpdate, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const getMedical = async (id: string) => {
    try {
        const { data }: { data: MedicalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/medical/details/${id}`, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};