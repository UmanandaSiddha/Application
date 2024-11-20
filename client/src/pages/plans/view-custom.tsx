import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Plan } from "@/types/plan_types";
import { SinglePlanResponse } from "@/types/api-types";
import { periodEnum } from "./plan";

const ViewCustom = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const userId = search.get("user");
    const [plan, setPlan] = useState<Plan>();
    const { user, isPaid } = useSelector((state: RootState) => state.userReducer);

    const fetchCustomPlan = async () => {
        try {
            const { data }: { data: SinglePlanResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/plan/custom/view/${id}?user=${userId}`, { withCredentials: true });
            setPlan(data.plan);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchCustomPlan();
    }, [id]);

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

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="container px-6 py-8 mx-auto">
                <div className="xl:items-center xl:-mx-8 xl:flex">
                    <div className="flex flex-col items-center xl:items-start xl:mx-8">
                        <h1 className="text-2xl font-medium text-gray-800 capitalize lg:text-3xl dark:text-white">Custom Plan {id}</h1>

                        <div className="mt-4">
                            <span className="inline-block w-40 h-1 bg-blue-500 rounded-full"></span>
                            <span className="inline-block w-3 h-1 mx-1 bg-blue-500 rounded-full"></span>
                            <span className="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
                        </div>
                    </div>

                    {plan ? (
                        <div className="flex-1 xl:mx-8">
                            <div className="mt-8 space-y-8 md:-mx-4 md:flex md:items-center md:justify-center md:space-y-0 xl:mt-0">
                                <div className="max-w-sm mx-auto border rounded-lg md:mx-4 dark:border-gray-700">
                                    <div className="p-6">
                                        <h1 className="text-xl font-medium text-gray-700 capitalize lg:text-2xl dark:text-white">{plan?.name}</h1>

                                        <p className="mt-4 text-gray-500 dark:text-gray-300">
                                            {plan?.description}
                                        </p>

                                        <h2 className="mt-4 text-2xl font-semibold text-gray-700 sm:text-3xl dark:text-gray-300">Rs. {plan?.amount} <span className="text-sm text-gray-400">Once in {plan?.interval} {periodToDays(plan ? plan?.period : "weekly")}{plan?.interval && plan?.interval > 1 && "s"}</span></h2>

                                        <p className="mt-1 text-gray-500 dark:text-gray-300">
                                            {user?.activePlan?.planId === plan?._id && ["active", "pending"].includes(user?.activePlan?.status!) && ("active")}
                                        </p>

                                        <button
                                            disabled={isPaid}
                                            onClick={() => navigate(`/checkout?id=${plan?._id}`)}
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

                                                <span className="mx-4 text-gray-700 dark:text-gray-300">Cards: {plan?.cards}</span>
                                            </div>

                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>

                                                <span className="mx-4 text-gray-700 dark:text-gray-300">Period: {plan?.period}</span>
                                            </div>

                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>

                                                <span className="mx-4 text-gray-700 dark:text-gray-300">Interval: {plan?.interval}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ): (
                        <p className="mt-10 text-center text-2xl font-semibold">No Plan Here</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ViewCustom;