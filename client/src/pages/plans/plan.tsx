// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Plan } from "@/types/plan_types";
// import { PlanResponse, UserResponse } from "@/types/api-types";
// import { toast } from "react-toastify";
// import { togglePaid, userExist } from "@/redux/reducer/userReducer";

export const periodEnum = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
};

const PlanPage = () => {

    // const navigate = useNavigate();
    // const dispatch = useDispatch();
    // const [plans, setPlans] = useState<Plan[] | null>();
    // const { user, isPaid } = useSelector((state: RootState) => state.userReducer);
    // const [role, setRole] = useState<string[]>((user && user.role === "org") ? ["org"] : ["user", "free"]);

    // const periodToDays = (period: string) => {
    //     switch (period) {
    //         case periodEnum.DAILY:
    //             return "day";
    //         case periodEnum.WEEKLY:
    //             return "week";
    //         case periodEnum.MONTHLY:
    //             return "month";
    //         case periodEnum.YEARLY:
    //             return "year";
    //     }
    // }

    // const handleOrgSwitch = () => {
    //     if (role.includes("user") || role.includes("free")) {
    //         setRole(["org"]);
    //     }
    // };

    // const handleUserSwitch = () => {
    //     if (role.includes("org")) {
    //         setRole(["user", "free"]);
    //     }
    // };

    // const fetchPlans = async () => {
    //     try {
    //         const { data }: { data: PlanResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/plan/all`, { withCredentials: true });
    //         setPlans(data.plans);
    //         const chachedPlan = {
    //             created: Date.now() + 30 * 1000,
    //             data: data.plans,
    //         }
    //         window.sessionStorage.setItem("all_plans", JSON.stringify(chachedPlan));
    //     } catch (error: any) {
    //         toast.error(error.response.data.message);
    //     }
    // };

    // useEffect(() => {
    //     const plansData = window.sessionStorage.getItem("all_plans");
    //     if (plansData) {
    //         if (JSON.parse(plansData)?.created < Date.now()) {
    //             window.localStorage.removeItem("all_plans");
    //             fetchPlans();
    //         } else {
    //             setPlans(JSON.parse(plansData).data);
    //         }
    //     } else {
    //         fetchPlans();
    //     }
    // }, []);

    // const handleFreePlan = async (id: string) => {
    //     try {
    //         const { data }: { data: UserResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/sub/new/free/${id}`, { data: "null" }, { withCredentials: true });
    //         dispatch(userExist(data.user));
    //         dispatch(togglePaid(true));
    //         toast.success("Free plan activated successfully");
    //     } catch (error: any) {
    //         toast.error(error.response.data.message);
    //     }
    // }

    return (
        <div className="pt-6 pb-16 h-screen bg-gradient-to-br overflow-x-hidden hide-scrollbar from-[#efe8fa] to-[#fcfafd]">
            <div className="flex flex-col items-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl mt-10 font-semibold text-center">Choose your right plan!</h1>
                <h2 className="text-center pb-8 md:pb-12 lg:pb-16 pt-5 text-base md:text-lg lg:text-xl text-gray-600">
                    Select from best plans, ensuring a perfect match. Need more or less? <br className="hidden md:block" />
                    Customize your subscription for a seamless fit!
                </h2>
                <div className="flex flex-col lg:flex-row  justify-center gap-6 px-4 md:px-0">
                    {/* Basic Plan */}
                    <div className=" w-96 max-sm:w-[22rem] mx-auto shadow-[0px_4px_36px_0px_rgba(0,_0,_0,_0.1)] bg-[#fffdfd] p-8 rounded-2xl mb-6 md:mb-0">
                        <button className="w-16 mb-5 bg-[#8547ff] h-9 rounded-xl text-white font-medium">Basic</button>
                        <p className="pb-10 text-gray-600">
                            The Starting Plan of Voolata.com, best for beginners and those seeking to explore more on this site.
                        </p>
                        <h1 className="text-4xl md:text-5xl">
                            <span className="font-semibold">Rs. 29</span> <span className="text-sm">Once in 1 month</span>
                        </h1>
                        <h2 className="text-sm mb-5">active</h2>
                        <hr />
                        <h1 className="pt-5">Details:</h1>
                        <ul className="outline-none pb-5">
                            <li>Cards: 50</li>
                            <li>Period: monthly</li>
                            <li>Interval: 1</li>
                        </ul>
                        <hr />
                        <button className="w-full border-2 h-12 font-semibold rounded-xl mt-5">Get Started</button>
                    </div>
                    {/* Pro Plan */}
                    <div className="w-96 max-sm:w-[22rem] mx-auto bg-[#fffdfd] shadow-[0px_4px_36px_0px_rgba(0,_0,_0,_0.1)] p-8 rounded-2xl mb-6 md:mb-0">
                        <button className="w-16 mb-5 bg-[#8547ff] h-9 rounded-xl font-medium text-white">Pro</button>
                        <p className="pb-16 text-gray-600">
                            The Pro Plan of Voolata.com, ideal for users looking for more advanced features.
                        </p>
                        <h1 className="text-4xl md:text-5xl">
                            <span className="font-semibold">Rs. 59</span> <span className="text-sm">Once in 1 month</span>
                        </h1>
                        <h2 className="text-sm mb-5">active</h2>
                        <hr />
                        <h1 className="pt-5">Details:</h1>
                        <ul className="outline-none pb-5">
                            <li>Cards: 100</li>
                            <li>Period: monthly</li>
                            <li>Interval: 1</li>
                        </ul>
                        <hr />
                        <button className="w-full border-2 h-12 font-semibold rounded-xl mt-5">Get Started</button>
                    </div>
                    {/* Custom Plan */}
                    <div className="w-96 max-sm:w-[22rem] mx-auto p-8 rounded-2xl shadow-[0px_4px_36px_0px_rgba(0,_0,_0,_0.1)] bg-gradient-to-b from-[#e1d7fa] to-[#ffffff]">
                        <button className="w-20 mb-5 h-9 rounded-xl font-bold text-black bg-white">Custom</button>
                        <p className="pb-10 text-gray-700">
                            If these plans don't fit, let's create one that suits. Customize your subscription for a perfect fit, bigger or smaller.
                        </p>
                        <h1 className="text-4xl md:text-5xl mb-5 pb-5">
                            <span className="font-semibold">Let's Talk!</span>
                        </h1>
                        <hr />
                        <h1 className="pt-5">Details:</h1>
                        <ul className="outline-none pb-5">
                            <li>Cards: 50</li>
                            <li>Period: monthly</li>
                            <li>Interval: 1</li>
                        </ul>
                        <hr />
                        <button className="w-full h-12 font-semibold rounded-xl mt-5 bg-[#2b233b] text-white">Get Started</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default PlanPage;
