import axios from "axios";
import { TreeResponse, SingleTreeResponse } from "../../types/api-types";

export const getUserTree = async (currentPage: number) => {
    try {
        const { data }: { data: TreeResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/user?page=${currentPage}&type=tree`, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteTree = async (id: string) => {
    try {
        const { data }: { data: SingleTreeResponse } = await axios.delete(`${import.meta.env.VITE_BASE_URL}/tree/delete/${id}?type=tree`, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
}

export const updateTree = async (treeData: object,id: string) => {
    try {
        const { data }: { data: SingleTreeResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=tree`, treeData, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
}


export const createTree = async (treeData: object) => {
    try {
        const { data }: { data: SingleTreeResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=tree`, treeData, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
}

export const getSingleTree = async (id: string) => {
    try {
        const { data }: { data: SingleTreeResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/details/${id}?type=tree`, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
}


