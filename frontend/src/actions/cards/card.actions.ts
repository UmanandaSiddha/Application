import API from "../../config/apiConfig";
import {
    CreateCardRequest,
    CreateCardResponse,
    CreateBatchCardsRequest,
    CreateBatchCardsResponse,
    UpdateCardRequest,
    DeleteCardResponse,
    GetUserCardsResponse,
    GetDisplayCardResponse,
    GetGeneralCardResponse,
} from "./card.types";

// 🔹 Create a New Card
export const createCard = async (data: CreateCardRequest): Promise<CreateCardResponse> => {
    const response = await API.post<CreateCardResponse>("/new", data);
    return response.data;
};

// 🔹 Create Batch Cards
export const createBatchCards = async (data: CreateBatchCardsRequest): Promise<CreateBatchCardsResponse> => {
    const response = await API.post<CreateBatchCardsResponse>("/new/batch", data);
    return response.data;
};

// 🔹 Update a Card
export const updateCard = async (id: string, data: UpdateCardRequest): Promise<CreateCardResponse> => {
    const response = await API.put<CreateCardResponse>(`/edit/${id}`, data);
    return response.data;
};

// 🔹 Delete a Card
export const deleteCard = async (id: string): Promise<DeleteCardResponse> => {
    const response = await API.delete<DeleteCardResponse>(`/edit/${id}`);
    return response.data;
};

// 🔹 Fetch User's Cards
export const getUserCards = async (): Promise<GetUserCardsResponse> => {
    const response = await API.get<GetUserCardsResponse>("/user");
    return response.data;
};

// 🔹 Get a Card for Display
export const getDisplayCard = async (id: string): Promise<GetDisplayCardResponse> => {
    const response = await API.get<GetDisplayCardResponse>(`/details/${id}`);
    return response.data;
};

// 🔹 Get a General Card (for the user)
export const getGeneralCard = async (id: string): Promise<GetGeneralCardResponse> => {
    const response = await API.get<GetGeneralCardResponse>(`/detailed/${id}`);
    return response.data;
};