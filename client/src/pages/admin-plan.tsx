import axios from "axios"

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
            name: "Fardin",
            description: "yay plan 2",
            amount: 299,
            cards: 50,
            planType: "user",
            period: "monthly",
            interval: 1
        }
        
        try {
            const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
            const { data }: { data: PlanResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/plan/new`, planData , config);
            console.log(data);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <button onClick={handlePlan}>Submit</button>
        </div>
    )
}

export default AdminPlan;