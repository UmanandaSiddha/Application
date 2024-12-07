import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Plan } from "@/types/plan_types";
import { SinglePlanResponse } from "@/types/api-types";
import { periodEnum } from "./plan";
import { Helmet } from "react-helmet-async";

const ViewCustom = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const userId = search.get("user");
    const [plan, setPlan] = useState<Plan>();
    const { isPaid } = useSelector((state: RootState) => state.userReducer);

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
        <>
            <Helmet>
                <title>Voolata | Custom Plan</title>
                <meta name="description" content={`This is the custom plan page of Voolata`} />
                <meta name="keywords" content="custom plan, voolata" />
            </Helmet>
            <div className="min-h-screen bg-gradient-to-br from-[#efe8fa] to-[#fcfafd] flex flex-col justify-center items-center py-6">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
                        Custom Plan
                    </h1>
                    <h2 className="pt-5 px-6 text-base md:text-lg lg:text-xl text-gray-600">
                        {plan?.name}
                    </h2>
                </div>
                <div className="flex flex-wrap justify-center gap-6 mt-10 px-4 sm:px-6">
                    {plan ? (
                        <div className="w-full sm:w-96 max-w-sm bg-gradient-to-b from-[#e1d7fa] to-[#ffffff] p-8 rounded-2xl shadow-md">
                            <button className="w-20 mb-5 h-9 rounded-xl font-bold text-black bg-white">
                                Custom
                            </button>
                            <p className="pb-10 text-gray-700">{plan.description}</p>
                            <h1 className="text-4xl md:text-5xl">
                                <span className="font-semibold">Rs. {plan.amount}</span>{" "}
                                <span className="text-sm">
                                    Once in {plan.interval} {periodToDays(plan.period)}
                                    {plan.interval > 1 && "s"}
                                </span>
                            </h1>
                            <hr className="border border-[#dddde0] mt-5" />
                            <h1 className="pt-5">Details:</h1>
                            <ul className="list-none pb-5">
                                <li>Cards: {plan.cards}</li>
                                <li>Period: {plan.period}</li>
                                <li>Interval: {plan.interval}</li>
                            </ul>
                            <hr className="border border-[#e9e9eb] mt-5" />
                            <button
                                onClick={() => {
                                    if (isPaid) {
                                        toast.warning("You already have a plan");
                                        return;
                                    }
                                    navigate(`/checkout?id=${plan?._id}&type=custom`);
                                }}
                                className="w-full h-12 font-semibold rounded-xl mt-5 bg-[#2b233b] text-white"
                            >
                                Get Started
                            </button>
                        </div>
                    ) : (
                        <p className="mt-10 text-center text-2xl font-semibold">No Plan Here</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default ViewCustom;