import axios from "axios"
import { toast } from "react-toastify";

type PlanResponse = {
    success: boolean;
    name: string;
    amount: number;
    cards: number;
    description: string;
    planType: string;
    period: string;
    interval: number;
    razorPlanId: string;
}

const AdminPlan = () => {

    const handlePlan = async () => {
        const planData = {
            name: "Special Weakly PLan",
            description: "description of this plan",
            amount: 29,
            cards: 12,
            planType: "user",
            period: "weekly",
            interval: 7
        }
        
        try {
            const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
            const { data }: { data: PlanResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/plan/new`, planData , config);
            console.log(data);
            toast.success("Success");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }
    return (
        <div>
            <button onClick={handlePlan}>Submit</button>
        </div>
    )
}

export default AdminPlan;