import {
    IndividualData,
    BotanyData,
    CreatorData,
    AnimalData,
    MedicalData,
    CardEnum
} from "../../types/type";

// 🔹 Create Card Request - Generic Type for Flexibility
export interface CreateCardRequest<T = IndividualData | BotanyData | CreatorData | AnimalData | MedicalData> {
    type: (typeof CardEnum)[keyof typeof CardEnum];
    data: T;
}

// 🔹 Create Card Response
export interface CreateCardResponse<T = IndividualData | BotanyData | CreatorData | AnimalData | MedicalData> {
    success: boolean;
    card: {
        id: string;
        type: (typeof CardEnum)[keyof typeof CardEnum];
        data: T;
        shortCode: string;
        userId: string;
    };
}

// 🔹 Create Batch Cards Request
export interface CreateBatchCardsRequest {
    names: string[];
    total: number;
    type: (typeof CardEnum)[keyof typeof CardEnum];
}

// 🔹 Create Batch Cards Response
export interface CreateBatchCardsResponse<T = IndividualData | BotanyData | CreatorData | AnimalData | MedicalData> {
    success: boolean;
    card: {
        id: string;
        type: (typeof CardEnum)[keyof typeof CardEnum];
        data: T;
        shortCode: string;
        userId: string;
    }[];
}

// 🔹 Update Card Request
export interface UpdateCardRequest<T = IndividualData | BotanyData | CreatorData | AnimalData | MedicalData> {
    data: T;
}

// 🔹 Delete Card Response
export interface DeleteCardResponse {
    success: boolean;
    message: string;
}

// 🔹 Get User Cards Response
export interface GetUserCardsResponse {
    success: boolean;
    count: number;
    resultPerPage: number;
    cards: {
        id: string;
        data: {
            name: string;
        };
        shortCode: string;
        createdAt: Date;
    }[];
    filteredCardsCount: number;
}

// 🔹 Get Display Card Response
export interface GetDisplayCardResponse<T = IndividualData | BotanyData | CreatorData | AnimalData | MedicalData> {
    success: boolean;
    card: {
        id: string;
        type: (typeof CardEnum)[keyof typeof CardEnum];
        data: T;
        shortCode: string;
        userId: string;
        createdAt: Date;
    };
}

// 🔹 Get General Card Response
export interface GetGeneralCardResponse<T = IndividualData | BotanyData | CreatorData | AnimalData | MedicalData> {
    success: boolean;
    card: {
        id: string;
        type: (typeof CardEnum)[keyof typeof CardEnum];
        data: T;
        shortCode: string;
        userId: string;
        createdAt: Date;
    };
}