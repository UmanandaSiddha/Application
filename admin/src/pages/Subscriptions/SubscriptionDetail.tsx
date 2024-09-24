import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Subscription } from "../../types/types";
import { SubscriptionResponse } from "../../types/api-types";
import Loader from "../../components/Loader";

const SubscriptionDetail = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const [subscription, setSubscription] = useState<Subscription>();
    const [status, setStatus] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchSubscription = async () => {
        setLoading(true);

        const cachedSubById = window.sessionStorage.getItem('sub_byId');
        if (cachedSubById) {
            const { data: cachedSub, expires, id: cachedId } = JSON.parse(cachedSubById);

            if (Date.now() < expires && cachedId === id) {
                setSubscription(cachedSub);
                setStatus(cachedSub.status);
                setLoading(false);
                return;
            }
        }

        window.sessionStorage.removeItem('sub_byId');

        try {
            const { data }: { data: SubscriptionResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/sub/byId/${id}`, { withCredentials: true });
            setSubscription(data.subscription);
            setStatus(data.subscription.status);
            const payload = {
                id,
                data: data.subscription,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('sub_byId', JSON.stringify(payload));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }

        setLoading(false);
    }

    useEffect(() => {
        fetchSubscription();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/sub/byId/${id}`, { withCredentials: true });
            window.sessionStorage.removeItem('sub_byId');
            toast.success("Subscription deleted successfully");
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setOpen(false);
    }

    const updateStatus = async () => {
        if (!status) {
            toast.warning("Select Status");
            return;
        }
        if (status === subscription?.status) {
            toast.warning(`Status is already ${status}`);
            return;
        }

        window.sessionStorage.removeItem('sub_byId');

        try {
            const { data }: { data: SubscriptionResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/sub/byId/${id}`, { status }, { withCredentials: true });
            setSubscription(data.subscription);
            setStatus(data.subscription.status);
            const payload = {
                id,
                data: data.subscription,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('sub_byId', JSON.stringify(payload));
            toast.success("Subscription status updated successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return loading ? (
        <Loader />
    ) : (
        <DefaultLayout>
            <div className="flex flex-wrap items-center justify-evenly gap-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl text-white underline font-semibold">Subscription Details</h1>
                    <p className="text-white"><span className="font-semibold">Id:</span> {subscription?._id}</p>
                    <p className="text-white"><span className="font-semibold">RazorPay Id:</span> {subscription?.razorSubscriptionId}</p>
                    <p className="text-white"><span className="font-semibold">Plan Id:</span> {subscription?.planId?._id}</p>
                    <p className="text-white"><span className="font-semibold">Plan Name:</span> {subscription?.planId?.name}</p>
                    <p className="text-white"><span className="font-semibold">Plan Amount:</span> {subscription?.planId?.amount}</p>
                    <p className="text-white"><span className="font-semibold">Billing Cycle:</span> {String(new Date(subscription?.start!).toDateString())} - {String(new Date(subscription?.end!).toDateString())}</p>
                    <p className="text-white"><span className="font-semibold">Current Cycle:</span> {String(new Date(subscription?.currentStart!).toDateString())} - {String(new Date(subscription?.currentEnd!).toDateString())}</p>
                    <p className="text-white"><span className="font-semibold">Next Billing:</span> {String(new Date(subscription?.nextBilling!).toDateString())}</p>
                    <p className="text-white"><span className="font-semibold">Total Count:</span> {subscription?.totalCount}</p>
                    <p className="text-white"><span className="font-semibold">Paid Count:</span> {subscription?.paidCount}</p>
                    <p className="text-white"><span className="font-semibold">Remaining Count:</span> {subscription?.remainingCount}</p>
                    <Link to={subscription?.shortUrl!} target="blank" className="text-white"><span className="font-semibold">Short Url:</span> <span className="italic underline">{subscription?.shortUrl}</span></Link>
                    <p className="text-white"><span className="font-semibold">Status:</span> {subscription?.status.toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Type:</span> {subscription?.subscriptionType.toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Payment Method:</span> {subscription?.paymentMethod?.methodType}</p>
                    <p className="text-white"><span className="font-semibold">Payment Details:</span> {subscription?.paymentMethod?.methodType === "card" ? `${subscription?.paymentMethod?.cardInfo?.name} ${subscription?.paymentMethod?.cardInfo?.cardType} ${subscription?.paymentMethod?.cardInfo?.last4}` : (subscription?.paymentMethod?.bankInfo || subscription?.paymentMethod?.upiInfo || subscription?.paymentMethod?.walletInfo)}</p>
                    <p className="text-white"><span className="font-semibold">{subscription?.subscriptionType === "user" ? "User" : "Donator"}:</span> {subscription?.subscriptionType === "user" ? subscription?.user : subscription?.donator}</p>
                    <p className="text-white"><span className="font-semibold">Subscription Created</span> - {String(new Date(subscription?.createdAt!).toDateString())}</p>
                    <p className="text-white"><span className="font-semibold">Subscription Upadated</span> - {String(new Date(subscription?.updatedAt!).toDateString())}</p>
                </div>

                {open && (
                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 w-[90%] md:w-[50%] lg:w-[30%]">
                            <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Are you sure you want to deactivate this subscription?</h2>
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

                <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4">
                        <select
                            className="text-black px-3 py-2 rounded-md border-2"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">ALL</option>
                            <option value="just_created">JUST CREATED</option>
                            <option value="created">CREATED</option>
                            <option value="authenticated">AUTHENTICATED</option>
                            <option value="active">ACTIVE</option>
                            <option value="pending">PENDING</option>
                            <option value="halted">HALTED</option>
                            <option value="cancelled">CANCELLED</option>
                            <option value="paused">PAUSED</option>
                            <option value="expired">EXPIRED</option>
                            <option value="completed">COMPLETED</option>
                        </select>
                        <button type="button" onClick={updateStatus} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                            Update Status
                        </button>
                    </div>

                    <button onClick={() => setOpen(true)} className="flex w-full justify-center rounded bg-red-500 p-3 font-medium text-gray hover:bg-opacity-90">
                        Delete Subscription
                    </button>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default SubscriptionDetail;