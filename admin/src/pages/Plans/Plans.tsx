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
    const [filter, setFilter] = useState({
        visible: true,
        type: "",
    });
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredPlans: 1,
        totalPlans: 1
    });
    const [loading, setLoading] = useState(false);

    const fetchPlans = async (url: string) => {
        try {
            const { data }: { data: AllPlansResponse } = await axios.get(url, { withCredentials: true });
            setPlans(data.plans);
            setCounts({
                ...counts,
                resultPerPage: data.resultPerPage,
                filteredPlans: data.filteredPlanCount,
                totalPlans: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
            setPlans([]);
        }
    }

    useEffect(() => {
        const queryParams = [
            `visible=${filter.visible}`,
            `page=${counts.currentPage}`,
            filter.type && `planType=${filter.type}`,
        ].filter(Boolean).join("&");

        setLoading(true);

        const delayDebounce = setTimeout(() => {
            let link = `${import.meta.env.VITE_BASE_URL}/admin/plans/all?${queryParams}`;
            fetchPlans(link);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(delayDebounce);

    }, [filter, counts.currentPage]);

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
                            All Plans ( {filter ? counts.filteredPlans : counts.totalPlans} )
                        </h4>
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage - 1 })}
                                disabled={counts.currentPage === 1}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Prev
                            </button>
                            <p className="text-md font-semibold truncate">{counts.currentPage} / {Math.ceil(counts.filteredPlans / counts.resultPerPage)}</p>
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
                                disabled={counts.currentPage === Math.ceil(counts.filteredPlans / counts.resultPerPage)}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-evenly items-center space-y-4 py-6 px-4 md:px-6 xl:px-7.5">
                        <div>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filter.visible}
                                    className="sr-only peer"
                                    onChange={() => {
                                        setFilter(prev => ({
                                            ...prev,
                                            visible: !prev.visible
                                        }));
                                        setCounts({ ...counts, currentPage: 1 });
                                    }}
                                />
                                <div className="relative border-2 w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Visible</span>
                            </label>
                        </div>

                        <div className="inline-flex items-center cursor-pointer gap-4">
                            <select
                                className="text-black px-3 py-2 rounded-md border-2"
                                value={filter.type}
                                onChange={(e) => {
                                    setFilter({ ...filter, type: e.target.value });
                                    setCounts({ ...counts, currentPage: 1 });
                                }}
                            >
                                <option value="">ALL</option>
                                <option value="user">USER</option>
                                <option value="org">ORG</option>
                                <option value="free">FREE</option>
                                <option value="custom">CUSTOM</option>
                                <option value="donator">DONATOR</option>
                            </select>
                            <label className="ms-3 text-md font-semibold text-slate-700 dark:text-white">Type</label>
                        </div>

                        <div>
                            <button 
                                onClick={() => navigate("/plans/new?type=free")} 
                                className="bg-indigo-500 text-white py-2 px-4 rounded-md"
                            >
                                Create Free Plan
                            </button>
                        </div>

                        <div>
                            <button 
                                onClick={() => navigate("/plans/new?type=usual")} 
                                className="bg-green-500 text-white py-2 px-4 rounded-md"
                            >
                                Create New Plan
                            </button>
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

                    {loading ? (
                        <div className="flex justify-center items-center border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
                             <div className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}></div>
                        </div>
                    ) : (
                        <>
                            {plans?.map((plan, key) => (
                                <div
                                    className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                                    key={key}
                                    onClick={() => navigate(`/plans/details?id=${plan._id}`)}
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
                        </>
                    )}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Plans;