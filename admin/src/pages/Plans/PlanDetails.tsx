import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plan } from "../../types/types";
import { PlanResponse } from "../../types/api-types";
import axios from "axios";
import { toast } from "react-toastify";

const PlanDetails = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("id");
    const [plan, setPlan] = useState<Plan>();

    const fetchPlan = async () => {
        try {
            const { data }: { data: PlanResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/plans/${id}`, { withCredentials: true });
            setPlan(data.plan);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const localPlan = window.localStorage.getItem("all_plans");
        if (localPlan) {
            const extractedPlan = JSON.parse(localPlan).data.filter((plan: Plan) => plan._id === id);
            setPlan(extractedPlan[0]);
        } else {
            fetchPlan();
        }
    }, [id]);

    const handleSwitch = async () => {
        try {
            const { data }: { data: { message: string }} = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/plans/${id}`, { data: "random" }, { withCredentials: true });
            window.localStorage.removeItem("all_plans");
            toast.success(data.message);
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleDelete = async () => {
        try {
            const { data }: { data: { message: string }} = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/plans/${id}`, { withCredentials: true });
            window.localStorage.removeItem("all_plans");
            toast.success(data.message);
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <DefaultLayout>
            <div className="flex flex-wrap items-center justify-evenly gap-3">
                <div className="flex flex-col gap-1">
                    <p>Plan Id: {plan?._id}</p>
                    <p>Plan Name: {plan?.name}</p>
                    <p>Plan Price: {plan?.amount}</p>
                    <p>Plan Description: {plan?.description}</p>
                    <p>Plan Cards: {plan?.cards}</p>
                    <p>Plan Visibility: {plan?.visible.toString().toUpperCase()}</p>
                    <p>Plan Type: {plan?.planType}</p>
                    <p>Plan Period: {plan?.period}</p>
                    <p>Plan Interval: {plan?.interval}</p>
                    <p>Razorpay Plan Id: {plan?.razorPlanId}</p>
                    <p>Created At: {String(new Date(plan?.createdAt!).toDateString())}</p>
                    <p>Last Update: {String(new Date(plan?.updatedAt!).toDateString())}</p>
                </div>
                <div className="flex flex-col gap-4">
                    <button onClick={handleSwitch} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                        Switch Visibility
                    </button>
                    <button onClick={() => navigate(`/plan-new?type=${plan?.planType}&action=edit`)} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                        Update Plan
                    </button>
                    <button onClick={handleDelete} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                        Delete Plan
                    </button>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default PlanDetails;