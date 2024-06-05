import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const ViewCustom = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const [plan, setPlan] = useState<any>({});
    const { user } = useSelector((state: RootState) => state.userReducer);

    const fetchCustomPlan = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/plan/request/${id}`, { withCredentials: true });
            setPlan(data.plans);
            toast.success("Request Submitted!");
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchCustomPlan();
    }, [id]);

    return (
        <>
            <div className="flex justify-center mt-[1rem]">
                <h1 className="text-3xl font-semibold font-Philosopher">
                    Custom Plan
                </h1>
            </div>
            {(user?.role === "org" && user._id === plan.user) ? (
                <div className="md:flex md:justify-center">
                    <div className="flex flex-col justify-center md:justify-center items-center md:w-[60%] lg:w-[100%]">
                        <div className="w-full flex justify-center">
                            <div className="pt-4 w-full flex flex-col md:flex-col lg:flex-row justify-center items-center lg:w-[60%] lg:gap-6">
                                <div
                                    className="border-2 border-blue-500 shadow-xl p-2 py-4 rounded-xl w-[90%] my-2"
                                >
                                    <div className="flex flex-row py-4">
                                        <div className="basis-1/2 flex justify-end lg:justify-start lg:pl-4 font-Kanit ">
                                            <div className="">
                                                <p className="text-2xl font-bold">{plan?.name}</p>
                                                <div className="">
                                                    <p className="text-blue-400 bg-blue-200 px-1 py-1 rounded-lg">
                                                        Plan Validity: 30 Days
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
                                                    Rs.200
                                                </div>
                                            </div>
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
                                    <div className="flex flex-row font-Kanit pl-3">
                                        <div className="basis-2/5 flex justify-start pl-2">
                                            Period:
                                        </div>
                                        <div className="basis-3/5 flex justify-start pl-2">
                                            {plan?.period}
                                        </div>
                                    </div>
                                    <div className="w-full py-3 flex justify-center">
                                        <button
                                            className="w-[90%] py-2 bg-blue-500 text-white rounded-sm font-Kanit hover:cursor-pointer hover:bg-blue-400"
                                            onClick={() => {navigate(`/checkout/id=${id}`);}}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    This Plan is only for Orgnisations
                </div>
            )}

        </>
    )
}

export default ViewCustom;