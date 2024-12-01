import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plan } from "@/types/plan_types";
import { PlanResponse, UserResponse } from "@/types/api-types";
import { toast } from "react-toastify";
import { togglePaid, userExist } from "@/redux/reducer/userReducer";
import Loader from "@/components/rest/loader";

export const periodEnum = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
};

const PlanPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [plans, setPlans] = useState<Plan[] | null>();
    const { user, isPaid, loading } = useSelector((state: RootState) => state.userReducer);

    const periodToDays = (period: string) => {
        switch (period) {
            case periodEnum.DAILY:
                return "day";
            case periodEnum.WEEKLY:
                return "week";
            case periodEnum.MONTHLY:
                return "month";
            case periodEnum.YEARLY:
                return "year";
        }
    }

    const fetchPlans = async () => {
        try {
            const { data }: { data: PlanResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/plan/all`, { withCredentials: true });
            setPlans(data.plans);
            const chachedPlan = {
                created: Date.now() + 30 * 1000,
                data: data.plans,
            }
            window.sessionStorage.setItem("all_plans", JSON.stringify(chachedPlan));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        const plansData = window.sessionStorage.getItem("all_plans");
        if (plansData) {
            if (JSON.parse(plansData)?.created < Date.now()) {
                window.localStorage.removeItem("all_plans");
                fetchPlans();
            } else {
                setPlans(JSON.parse(plansData).data);
            }
        } else {
            fetchPlans();
        }
    }, []);

    const handleFreePlan = async (id: string) => {
        try {
            const { data }: { data: UserResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/sub/new/free/${id}`, { data: "null" }, { withCredentials: true });
            dispatch(userExist(data.user));
            dispatch(togglePaid(true));
            toast.success("Free plan activated successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    if (loading) return <Loader />

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#efe8fa] to-[#fcfafd] flex flex-col justify-center items-center py-6">
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
                    Choose your right plan!
                </h1>
                <h2 className="pt-5 px-6 text-base md:text-lg lg:text-xl text-gray-600">
                    Select from best plans, ensuring a perfect match. Need more or less? <br className="hidden md:block" />
                    Customize your subscription for a seamless fit!
                </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-10 px-4 sm:px-6">
                {plans
                    ?.filter(plan => plan.visible && ["user", "org", "free"].includes(plan.planType))
                    .map((plan, index) => (
                        <div
                            key={index}
                            className="w-full sm:w-96 max-w-sm bg-white p-8 rounded-2xl shadow-md"
                        >
                            <button className="w-16 mb-5 bg-purple-600 h-9 rounded-xl text-white font-medium">
                                {plan.name}
                            </button>
                            <p className="pb-10 text-gray-600">{plan.description}</p>
                            <h1 className="text-4xl md:text-5xl">
                                <span className="font-semibold">Rs. {plan.amount}</span>{" "}
                                <span className="text-sm">
                                    Once in {plan.interval} {periodToDays(plan.period)}
                                    {plan.interval > 1 && "s"}
                                </span>
                            </h1>
                            <h2 className="text-sm mb-5">
                                {user?.activePlan?.planId === plan._id &&
                                    ["active", "pending"].includes(user?.activePlan?.status) &&
                                    "active"}
                            </h2>
                            <hr />
                            <h1 className="pt-5">Details:</h1>
                            <ul className="list-none pb-5">
                                <li>Cards: {plan.cards}</li>
                                <li>Period: {plan.period}</li>
                                <li>Interval: {plan.interval}</li>
                            </ul>
                            <hr />
                            <button
                                onClick={() => {
                                    if (isPaid) {
                                        toast.warning("You already have a plan");
                                        return;
                                    }
                                    if (plan.planType === "free") {
                                        handleFreePlan(plan._id);
                                    } else {
                                        navigate(`/checkout?id=${plan?._id}`);
                                    }
                                }}
                                className="w-full border-2 h-12 font-semibold rounded-xl mt-5"
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                <div className="w-full sm:w-96 max-w-sm bg-gradient-to-b from-[#e1d7fa] to-[#ffffff] p-8 rounded-2xl shadow-md">
                    <button className="w-20 mb-5 h-9 rounded-xl font-bold text-black bg-white">
                        Custom
                    </button>
                    <p className="pb-10 text-gray-700">
                        If these plans don't fit, let's create one that suits. Customize your subscription
                        for a perfect fit, bigger or smaller.
                    </p>
                    <h1 className="text-4xl md:text-5xl mb-5 pb-5">
                        <span className="font-semibold">Let's Talk!</span>
                    </h1>
                    <hr />
                    <h1 className="pt-5">Details:</h1>
                    <ul className="list-none pb-5">
                        <li>Cards: 50</li>
                        <li>Period: monthly</li>
                        <li>Interval: 1</li>
                    </ul>
                    <hr />
                    <button
                        onClick={() => navigate(`/request-custom`)}
                        className="w-full h-12 font-semibold rounded-xl mt-5 bg-[#2b233b] text-white"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanPage;
