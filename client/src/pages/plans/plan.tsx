import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plan } from "@/types/plan_types";
import { PlanResponse } from "@/types/api-types";
import { toast } from "react-toastify";

const periodEnum = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
};

const PlanPage = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState<Plan[] | null>();
    const [role, setRole] = useState<string>("user");
    const { user, isPaid } = useSelector((state: RootState) => state.userReducer);

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

    const handleOrgSwitch = () => {
        if (role === "user") {
            setRole("org");
        }
    }

    const handleUserSwitch = () => {
        if (role === "org") {
            setRole("user");
        }
    }

    const fetchPlans = async () => {
        try {
            const { data }: { data: PlanResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/plan/all`, { withCredentials: true });
            setPlans(data.plans);
            window.sessionStorage.setItem("all_plans", JSON.stringify(data.plans));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        const plansData = window.sessionStorage.getItem("all_plans");
        if (plansData) {
            setPlans(JSON.parse(plansData));
        } else {
            fetchPlans();
        }
    }, []);

    return (
        <>
            {(!user || user?.role === "admin") && (
                <div className="flex justify-center items-center h-full w-full mt-3">
                    <div className="inline-flex justify-center items-center border-2 border-blue-500 shadow-x rounded-lg">
                        <button
                            className={`px-4 py-2 ${role === "user" ? "bg-blue-500 text-white rounded-md" : "text-blue-500"}`}
                            onClick={() => handleUserSwitch()}
                        >
                            Individual
                        </button>
                        <button
                            className={`px-4 py-2 ${role === "org" ? "bg-blue-500 text-white rounded-md" : "text-blue-500"}`}
                            onClick={() => handleOrgSwitch()}
                        >
                            Organisation
                        </button>
                    </div>
                </div>
            )}
            <div className="md:flex md:justify-center">
                <div className="flex flex-col justify-center md:justify-center items-center md:w-[60%] lg:w-[100%]">
                    <div className="w-full flex justify-center">
                        <div className="pt-4 w-full flex flex-col md:flex-col lg:flex-row justify-center items-center lg:w-[60%] lg:gap-6">
                            {plans?.map((plan: Plan, index: number) => (
                                <div key={index}>
                                    {plan.visible && ((user && user.role !== "admin") ? user?.role === plan.planType : role === plan.planType) && (
                                        <div
                                            className="border-2 border-blue-500 shadow-xl p-2 py-4 rounded-xl w-[90%] my-2"
                                        >
                                            {user?.activePlan?.planId === plan._id && ["active", "pending"].includes(user?.activePlan?.status) && (
                                                <>
                                                    <span className="relative -top-[1.8rem] left-4 bg-blue-300 text-blue-500 rounded-md font-Philosopher font-bold px-2 py-1 text-sm">
                                                        active
                                                    </span>
                                                </>
                                            )}
                                            <div className="flex flex-row py-4">
                                                <div className="basis-1/2 flex justify-end lg:justify-start lg:pl-4 font-Kanit ">
                                                    <div className="">
                                                        <p className="text-2xl font-bold">{plan.name}</p>
                                                        <div className="">
                                                            <p className="text-blue-400 bg-blue-200 px-2 py-1 rounded-lg">
                                                                Plan Billing: Once in {plan.interval} {periodToDays(plan.period)}{plan.interval > 1 && "s"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="basis-1/2">
                                                    <div className="">
                                                        <div className="font-Kanit text-lg flex justify-end pr-4 text-slate-400">
                                                            Price
                                                        </div>
                                                        <div className="font-Kanit text-xl flex justify-end pr-4 text-black">
                                                            Rs. {plan.amount}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-row font-Kanit pl-3">
                                                <div className="basis-2/5 flex justify-start pl-2">
                                                    Plan Description:
                                                </div>
                                                <div className="basis-3/5 flex justify-start pl-2">
                                                    {plan.description}
                                                </div>
                                            </div>
                                            <div className="flex flex-row font-Kanit pl-3">
                                                <div className="basis-2/5 flex justify-start pl-2">
                                                    Plan ID:
                                                </div>
                                                <div className="basis-3/5 flex justify-start pl-2">
                                                    {plan?.razorPlanId}
                                                </div>
                                            </div>
                                            <div className="flex flex-row font-Kanit pl-3">
                                                <div className="basis-2/5 flex justify-start pl-2">
                                                    VCards Allowed:
                                                </div>
                                                <div className="basis-3/5 flex justify-start pl-2">
                                                    {plan?.cards}
                                                </div>
                                            </div>
                                            <div className="w-full py-3 flex justify-center">
                                                <button
                                                    disabled={isPaid}
                                                    className="w-[90%] py-2 bg-blue-500 text-white rounded-md font-Kanit hover:cursor-pointer hover:bg-blue-400"
                                                    onClick={() => {
                                                        navigate(`/checkout?id=${plan?._id}`);
                                                    }}
                                                >
                                                    Buy Now
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlanPage;
