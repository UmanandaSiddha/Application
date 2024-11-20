import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plan } from "@/types/plan_types";
import { PlanResponse, UserResponse } from "@/types/api-types";
import { toast } from "react-toastify";
import { togglePaid, userExist } from "@/redux/reducer/userReducer";

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
    const { user, isPaid } = useSelector((state: RootState) => state.userReducer);
    const [role, setRole] = useState<string[]>((user && user.role === "org") ? ["org"] : ["user", "free"]);

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
        if (role.includes("user") || role.includes("free")) {
            setRole(["org"]);
        }
    };

    const handleUserSwitch = () => {
        if (role.includes("org")) {
            setRole(["user", "free"]);
        }
    };

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

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="container px-6 py-8 mx-auto">
                <div className="xl:items-center xl:-mx-8 xl:flex">
                    <div className="flex flex-col items-center xl:items-start xl:mx-8">
                        <h1 className="text-2xl font-medium text-gray-800 capitalize lg:text-3xl dark:text-white">Our Pricing Plan</h1>

                        <div className="mt-4">
                            <span className="inline-block w-40 h-1 bg-blue-500 rounded-full"></span>
                            <span className="inline-block w-3 h-1 mx-1 bg-blue-500 rounded-full"></span>
                            <span className="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
                        </div>

                        {(user && user?.role === "admin") && (
                            <div className="flex justify-center items-center h-full w-full mt-3">
                                <div className="inline-flex justify-center items-center border-2 border-blue-500 shadow-x rounded-lg">
                                    <button
                                        className={`px-4 py-2 ${(role.includes("user") || role.includes("free")) ? "bg-blue-500 text-white rounded-md" : "text-blue-500"}`}
                                        onClick={() => handleUserSwitch()}
                                    >
                                        Individual
                                    </button>
                                    <button
                                        className={`px-4 py-2 ${role.includes("org") ? "bg-blue-500 text-white rounded-md" : "text-blue-500"}`}
                                        onClick={() => handleOrgSwitch()}
                                    >
                                        Organisation
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 xl:mx-8">
                        <div className="mt-8 space-y-8 md:-mx-4 md:flex md:items-center md:justify-center md:space-y-0 xl:mt-0">
                            {plans?.map((plan: Plan, index: number) => (
                                <div key={index}>
                                    {plan.visible && ((user && user.role !== "admin") ? (user.role === "user" ? [`${user?.role}`, "free"].includes(plan.planType) : [`${user?.role}`].includes(plan.planType)) : role.includes(plan.planType)) && (
                                        <div className="max-w-sm mx-auto border rounded-lg md:mx-4 dark:border-gray-700">
                                            <div className="p-6">
                                                <h1 className="text-xl font-medium text-gray-700 capitalize lg:text-2xl dark:text-white">{plan.name}</h1>

                                                <p className="mt-4 text-gray-500 dark:text-gray-300">
                                                    {plan.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, blanditiis?
                                                </p>

                                                <h2 className="mt-4 text-2xl font-semibold text-gray-700 sm:text-3xl dark:text-gray-300">Rs. {plan.amount} <span className="text-sm text-gray-400">Once in {plan.interval} {periodToDays(plan.period)}{plan.interval > 1 && "s"}</span></h2>

                                                <p className="mt-1 text-gray-500 dark:text-gray-300">
                                                    {user?.activePlan?.planId === plan._id && ["active", "pending"].includes(user?.activePlan?.status) && ("active")}
                                                </p>

                                                <button
                                                    // disabled={isPaid}
                                                    onClick={() => {
                                                        if (isPaid) {
                                                            toast.warning("You already have a plan");
                                                            return;
                                                        }
                                                        if (plan.planType === "free") {
                                                            handleFreePlan(plan._id)
                                                        } else {
                                                            navigate(`/checkout?id=${plan?._id}`)
                                                        }
                                                    }}
                                                    className="w-full px-4 py-2 mt-6 tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                                                >
                                                    Buy Plan
                                                </button>
                                            </div>

                                            <hr className="border-gray-200 dark:border-gray-700" />

                                            <div className="p-6">
                                                <h1 className="text-lg font-medium text-gray-700 capitalize lg:text-xl dark:text-white">Details:</h1>

                                                <div className="mt-8 space-y-4">
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>

                                                        <span className="mx-4 text-gray-700 dark:text-gray-300">Cards: {plan.cards}</span>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>

                                                        <span className="mx-4 text-gray-700 dark:text-gray-300">Period: {plan.period}</span>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>

                                                        <span className="mx-4 text-gray-700 dark:text-gray-300">Interval: {plan.interval}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {["org", "admin"].includes(user?.role!) && role.includes("org") && (
                                <div className="max-w-sm mx-auto border rounded-lg md:mx-4 dark:border-gray-700">
                                    <div className="p-6">
                                        <h1 className="text-xl font-medium text-gray-700 capitalize lg:text-2xl dark:text-white">Custom Plan</h1>

                                        <p className="mt-4 text-gray-500 dark:text-gray-300">
                                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque, molestiae! ghdgfh hdfghd dfg dfthgdf
                                        </p>

                                        <h2 className="mt-4 text-2xl font-semibold text-gray-700 sm:text-3xl dark:text-gray-300">Rs. 00 <span className="text-sm text-gray-400">Once in</span></h2>

                                        <p className="mt-1 text-gray-500 dark:text-gray-300">
                                            {/* {user?.activePlan?.planId === plan._id && ["active", "pending"].includes(user?.activePlan?.status) && ("active")} */}
                                        </p>

                                        <button
                                            onClick={() => {
                                                if (isPaid) {
                                                    toast.warning("You already have a plan");
                                                    return;
                                                } else {
                                                    navigate(`/request-custom`);
                                                }
                                            }}
                                            className="w-full px-4 py-2 mt-6 tracking-wide text-white capitalize transition-colors duration-300 transform bg-slate-600 rounded-md hover:bg-slate-500 focus:outline-none focus:bg-slate-500 focus:ring focus:ring-slate-300 focus:ring-opacity-80"
                                        >
                                            Request Custom Plan
                                        </button>
                                    </div>
                                    <hr className="border-gray-200 dark:border-gray-700" />
                                    <div className="p-6">
                                        <h1 className="text-lg font-medium text-gray-700 capitalize lg:text-xl dark:text-white">Details:</h1>

                                        <div className="mt-8 space-y-4">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>

                                                <span className="mx-4 text-gray-700 dark:text-gray-300">Cards: 00</span>
                                            </div>

                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>

                                                <span className="mx-4 text-gray-700 dark:text-gray-300">Period: 00</span>
                                            </div>

                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>

                                                <span className="mx-4 text-gray-700 dark:text-gray-300">Interval: 00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanPage;
