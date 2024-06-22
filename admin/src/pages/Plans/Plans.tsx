import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { Plan } from "../../types/types";
import { toast } from "react-toastify";
import { AllPlansResponse } from "../../types/api-types";
import axios from "axios";

const periodEnum = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
};

const Plans = () => {

    const navigate = useNavigate();
    const [plans, setPlans] = useState<Plan[]>();

    const fetchPlans = async () => {
        try {
            const { data }: { data: AllPlansResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/plans/all`, { withCredentials: true });
            setPlans(data.plans);
            const localPlans = {
                created: Date.now() + 30 * 1000,
                data: data.plans,
            }
            window.localStorage.setItem("all_plans", JSON.stringify(localPlans));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const cardData = window.localStorage.getItem("all_plans");
        if (cardData) {
            if (JSON.parse(cardData)?.created < Date.now()) {
                window.localStorage.removeItem("all_plans");
                fetchPlans();
            } else {
                setPlans(JSON.parse(cardData).data);
            }
        } else {
            fetchPlans();
        }
    }, []);

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
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex justify-between items-center py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Plans
                        </h4>
                        <div className="flex justify-center items-center space-x-4">
                            <button onClick={() => navigate("/plan-new?type=free")} className="bg-blue-500 text-white py-2 px-4 rounded-md">Free Plan</button>
                            <button onClick={() => navigate("/plan-new?type=usual")} className="bg-green-500 text-white py-2 px-4 rounded-md">New</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                        <div className="col-span-2 flex items-center">
                            <p className="font-medium">Name</p>
                        </div>
                        <div className="col-span-1 hidden items-center sm:flex">
                            <p className="font-medium">Validity</p>
                        </div>
                        <div className="col-span-1 hidden items-center sm:flex">
                            <p className="font-medium">Amount</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Cards</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Type</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Visible</p>
                        </div>
                        <div className="col-span-1 hidden items-center sm:flex">
                            <p className="font-medium">Plan Id</p>
                        </div>
                    </div>

                    {plans?.map((plan, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/plan-details?id=${plan._id}`)}
                        >
                            <div className="col-span-2 flex items-center">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <p className="text-sm text-black dark:text-white">
                                        {plan.name}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {plan.interval} {periodToDays(plan.period)}{plan.interval > 1 && "s"}
                                </p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {plan.amount}
                                </p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {plan.cards}
                                </p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {plan.planType.toUpperCase()}
                                </p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {plan.visible.toString().toUpperCase()}
                                </p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {plan.razorPlanId}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Plans;