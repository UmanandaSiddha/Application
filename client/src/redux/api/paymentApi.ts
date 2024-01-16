import axios from "axios";
import { PaymentResponse} from "../../types/api-types";


export const getAllPayments = async () => {
    try {
        const { data }: { data: PaymentResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/pay/view`, { withCredentials: true } );
        return data;
    } catch (error) {
        throw error;
    }
};

export const checkoutPayments = async (paymentInfo: object) => {
    try {
        const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
        const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/pay/checkout`, paymentInfo, config);
        return data;
    } catch (error) {
        throw error;
    }
};