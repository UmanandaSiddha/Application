import axios from "axios";
import { CreatorResponse } from "@/types/api-types";

export const createCreator = async (creatorData: any) => {
    try {
        const { data }: { data: CreatorResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/creator/new`, creatorData, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const viewCreator = async () => {
    try {
        const { data }: { data: CreatorResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/creator/view`, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateCreator = async (creatorUpdate: any, id: string) => {
    try {
        const { data }: { data: CreatorResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/creator/update/${id}`, creatorUpdate, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const getCreator = async (id: string) => {
    try {
        const { data }: { data: CreatorResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/creator/details/${id}`, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};