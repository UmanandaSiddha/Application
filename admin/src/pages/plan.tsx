import axios from "axios";
import { useState } from "react";

const periodEnum = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
};

const Plan = () => {

    const [plan, setPlan] = useState({
        name: "",
        amount: "",
        description: "",
        vcards: "",
        period: "",
        interval: ""
    });

    const handleChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
        setPlan({ ...plan, [e.target.name]: e.target.value });
    }

    const handlePlan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const planData = {
            name: plan.name,
            amount: Number(plan.amount),
            description: plan.description,
            vcards: Number(plan.vcards),
            period: plan.period,
            interval: Number(plan.interval)
        }
        console.log(planData);
        try {
            const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
            const { data }: any = await axios.post(`${import.meta.env.VITE_BASE_URL}/plan/new`, planData, config);
            console.log(data)
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <h1 className="text-2xl font-semibold">Create Plans</h1>
            <form onSubmit={handlePlan} className="flex flex-col justify-center items-center gap-2">
                <input 
                    type="text" 
                    name="name"
                    placeholder="enter plan name" 
                    value={plan.name} 
                    onChange={(e) => handleChange(e)} 
                />
                <input 
                    type="number" 
                    name="amount"
                    placeholder="enter plan amount" 
                    value={plan.amount} 
                    onChange={(e) => handleChange(e)} 
                />
                <input 
                    type="text" 
                    name="description"
                    placeholder="enter plan description" 
                    value={plan.description} 
                    onChange={(e) => handleChange(e)} 
                />
                <input 
                    type="number" 
                    name="vcards"
                    placeholder="enter allowed vcards" 
                    value={plan.vcards} 
                    onChange={(e) => handleChange(e)} 
                />
                <select
                    value={plan.period}
                    onChange={(e) => setPlan({ ...plan, period: e.target.value })}
                >
                    <option value={periodEnum.DAILY}>DAILY</option>
                    <option value={periodEnum.WEEKLY}>WEEKLY</option>
                    <option value={periodEnum.MONTHLY}>MONTHLY</option>
                    <option value={periodEnum.YEARLY}>YEARLY</option>
                </select>
                <input 
                    type="number" 
                    name="interval"
                    placeholder="enter plan interval" 
                    value={plan.interval} 
                    onChange={(e) => handleChange(e)} 
                />
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default Plan;