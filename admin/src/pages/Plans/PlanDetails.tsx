import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plan } from "../../types/types";
import { PlanResponse } from "../../types/api-types";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const PlanDetails = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("id");
    const [plan, setPlan] = useState<Plan>();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchPlan = async () => {
        setLoading(true);

        const cachedPlanById = window.sessionStorage.getItem('plan_byId');
        if (cachedPlanById) {
            const { data: cachedPlan, expires, id: cachedId } = JSON.parse(cachedPlanById);

            if (Date.now() < expires && cachedId === id) {
                setPlan(cachedPlan);
                setLoading(false);
                return;
            }
        }

        window.sessionStorage.removeItem('plan_byId');

        try {
            const { data }: { data: PlanResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/plans/byId/${id}`, { withCredentials: true });
            setPlan(data.plan);
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
        fetchPlan();
    }, [id]);

    const handleSwitch = async () => {
        try {
            const { data }: { data: { message: string } } = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/plans/byId/${id}`, { data: "random" }, { withCredentials: true });
            window.sessionStorage.removeItem('plan_byId');
            toast.success(data.message);
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleDelete = async () => {
        try {
            const { data }: { data: { message: string } } = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/plans/byId/${id}`, { withCredentials: true });
            window.sessionStorage.removeItem('plan_byId');
            toast.success(data.message);
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setOpen(false);
    }

    return loading ? (
        <Loader />
    ) : (
        <DefaultLayout>
            <div className="w-full mt-8 flex flex-col md:flex-row flex-wrap items-center justify-evenly gap-3 space-y-6">
                <div className="flex flex-col gap-1 px-4">
                    <h1 className="text-3xl text-white font-semibold mb-6 underline">Plan Details</h1>
                    <p className="text-white"><span className="font-semibold">Plan Id:</span> {plan?._id}</p>
                    <p className="text-white"><span className="font-semibold">Plan Name:</span> {plan?.name}</p>
                    <p className="text-white"><span className="font-semibold">Plan Price:</span> {plan?.amount}</p>
                    <p className="text-white"><span className="font-semibold">Plan Description:</span> {plan?.description}</p>
                    <p className="text-white"><span className="font-semibold">Plan Cards:</span> {plan?.cards}</p>
                    <p className="text-white"><span className="font-semibold">Plan Visibility:</span> {plan?.visible.toString().toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Plan Type:</span> {plan?.planType}</p>
                    <p className="text-white"><span className="font-semibold">Plan Period:</span> {plan?.period}</p>
                    <p className="text-white"><span className="font-semibold">Plan Interval:</span> {plan?.interval}</p>
                    <p className="text-white"><span className="font-semibold">Razorpay Plan Id:</span> {plan?.razorPlanId}</p>
                    <p className="text-white"><span className="font-semibold">Created At:</span> {String(new Date(plan?.createdAt!).toDateString())}</p>
                    <p className="text-white"><span className="font-semibold">Last Update:</span> {String(new Date(plan?.updatedAt!).toDateString())}</p>
                </div>
                {open && (
                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 w-[90%] md:w-[50%] lg:w-[30%]">
                            <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Are you sure you want to deactivate this plan?</h2>
                            <div className="w-full mt-8 flex justify-between items-center gap-8">
                                <button className="w-1/2 px-3 py-2 border-2 border-red-500 rounded-lg bg-red-500 text-white" onClick={handleDelete}>
                                    Yes, I am sure!!
                                </button>
                                <button className="w-1/2 px-3 py-2 border-2 text-white rounded-lg" onClick={() => setOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <h1 className="text-3xl text-white font-semibold mb-6 underline">Plan Actions</h1>
                    <button onClick={handleSwitch} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                        Switch Visibility
                    </button>
                    <button onClick={() => navigate(`/plans/new?type=${plan?.planType}&id=${plan?._id}`)} className="flex w-full justify-center rounded bg-slate-500 p-3 font-medium text-gray hover:bg-opacity-90">
                        Update Plan
                    </button>
                    <button onClick={() => setOpen(true)} className="flex w-full justify-center rounded bg-red-500 p-3 font-medium text-gray hover:bg-opacity-90">
                        Delete Plan
                    </button>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default PlanDetails;