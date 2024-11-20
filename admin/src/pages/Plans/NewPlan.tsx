
import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PlanResponse } from "../../types/api-types";
import Loader from "../../components/Loader";

const NewPlan = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const type = search.get('type');
    const [planData, setPlanData] = useState({
        name: "",
        amount: 0,
        cards: 0,
        description: "",
        planType: "",
        period: "",
        interval: 0
    });
    const [planLoading, setPlanLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const fetchPlan = async () => {
        setLoading(true);

        const cachedPlanById = window.sessionStorage.getItem('plan_byId');
        if (cachedPlanById) {
            const { data: cachedPlan, expires, id: cachedId } = JSON.parse(cachedPlanById);

            if (Date.now() < expires && cachedId === id) {
                setPlanData({
                    name: cachedPlan.name,
                    description: cachedPlan.description,
                    planType: cachedPlan.planType,
                    cards: cachedPlan.cards,
                    amount: cachedPlan.amount,
                    period: cachedPlan.period,
                    interval: cachedPlan.interval
                });
                setLoading(false);
                return;
            }
        }

        window.sessionStorage.removeItem('plan_byId');

        try {
            const { data }: { data: PlanResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/plans/byId/${id}`, { withCredentials: true });
            setPlanData({
                name: data.plan.name,
                description: data.plan.description,
                planType: data.plan.planType,
                cards: data.plan.cards,
                amount: data.plan.amount,
                period: data.plan.period,
                interval: data.plan.interval
            });
            const payload = {
                id,
                data: data.plan,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('plan_byId', JSON.stringify(payload));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (id) {
            fetchPlan();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPlanLoading(true);
        const { name, description, planType, cards, amount, period, interval } = planData;
        if (
            !name ||
            !description ||
            !period ||
            !interval ||
            !cards ||
            (type !== "free" && (!planType || !amount))
        ) {
            toast.warning("All fields are required");
            setPlanLoading(false);
            return;
        };
        try {
            if (id) {
                if (type === "free") {
                    await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/plans/free/${id}`, planData, { withCredentials: true });
                } else {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/plans/byId/${id}`, planData, { withCredentials: true });
                }
            } else {
                if (type === "free") {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/plans/free/new`, planData, { withCredentials: true });
                } else {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/plans/new`, planData, { withCredentials: true });
                }

            }
            toast.success(`${type === "free" ? "Free " : ""}Plan ${id ? "upadated" : "created"} successfully`);
            const localPlan = window.localStorage.getItem("all_plans");
            if (localPlan) {
                window.localStorage.removeItem("all_plans");
            }
            navigate(-1)
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setPlanLoading(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setPlanData(prevState => ({
            ...prevState,
            [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value
        }));
    };

    return loading ? (
        <Loader />
    ) : (    
        <DefaultLayout>
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-4 px-16">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h2 className="font-medium text-2xl text-black dark:text-white capitalize">
                                {id ? "Update" : "New"} {type} Plan
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6.5">
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Plan name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={planData.name}
                                            onChange={handleChange}
                                            placeholder="Enter plan name"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Cards
                                        </label>
                                        <input
                                            type="number"
                                            name="cards"
                                            value={planData.cards !== null ? planData.cards : ''}
                                            onChange={handleChange}
                                            placeholder="Enter plan cards"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                {type !== "free" && (
                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Amount
                                            </label>
                                            <input
                                                type="number"
                                                name="amount"
                                                disabled={id ? true : false}
                                                placeholder="Enter plan amount"
                                                value={planData.amount !== null ? planData.amount : ''}
                                                onChange={handleChange}
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Plan Type
                                            </label>
                                            <div className="relative z-20 bg-transparent dark:bg-form-input">
                                                <select
                                                    name="planType"
                                                    value={planData.planType}
                                                    disabled={id ? true : false}
                                                    onChange={handleChange}
                                                    className={`w-full rounded appearance-none border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                                                >
                                                    <option value="" className="text-body dark:text-bodydark">
                                                        Choose Type
                                                    </option>
                                                    <option value="user" className="text-body dark:text-bodydark">
                                                        USER
                                                    </option>
                                                    <option value="org" className="text-body dark:text-bodydark">
                                                        ORG
                                                    </option>
                                                    {type === "donator" && (
                                                        <option value="donator" className="text-body dark:text-bodydark">
                                                            DONATOR
                                                        </option>
                                                    )}
                                                    {type !== "usual" && (
                                                        <>
                                                            <option value="free" className="text-body dark:text-bodydark">
                                                                FREE
                                                            </option>
                                                            <option value="custom" className="text-body dark:text-bodydark">
                                                                CUSTOM
                                                            </option>
                                                        </>
                                                    )}
                                                </select>

                                                <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                                    <svg
                                                        className="fill-current"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <g opacity="0.8">
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                                fill=""
                                                            ></path>
                                                        </g>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Interval
                                        </label>
                                        <input
                                            type="number"
                                            name="interval"
                                            disabled={(type!=="free" && id) ? true : false}
                                            value={planData.interval !== null ? planData.interval : ''}
                                            onChange={handleChange}
                                            placeholder="Enter plan interval"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Period
                                        </label>
                                        <div className="relative z-20 bg-transparent dark:bg-form-input">

                                            <select
                                                name="period"
                                                value={planData.period}
                                                disabled={(type!=="free" && id) ? true : false}
                                                onChange={handleChange}
                                                className={`w-full rounded appearance-none border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                                            >
                                                <option value="" className="text-body dark:text-bodydark">
                                                    Choose Period
                                                </option>
                                                <option value="daily" className="text-body dark:text-bodydark">
                                                    DAILY
                                                </option>
                                                <option value="weekly" className="text-body dark:text-bodydark">
                                                    WEEKLY
                                                </option>
                                                <option value="monthly" className="text-body dark:text-bodydark">
                                                    MONTHLY
                                                </option>
                                                <option value="yearly" className="text-body dark:text-bodydark">
                                                    YEARLY
                                                </option>
                                            </select>

                                            <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                                <svg
                                                    className="fill-current"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g opacity="0.8">
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                            fill=""
                                                        ></path>
                                                    </g>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        name="description"
                                        value={planData.description}
                                        onChange={handleChange}
                                        placeholder="Plan Description"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    ></textarea>
                                </div>

                                <button type="submit" disabled={planLoading || !type} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                                    {planLoading ? "Hold on..." : id ? "Update Plan" : "Create Plan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default NewPlan;