import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout"
import { useEffect, useState } from "react";
import { CustomReuest } from "../../types/types";
import { CustomRequestResponse } from "../../types/api-types";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const CustomDetails = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const [requests, setRequests] = useState<CustomReuest>();
    const [open, setOpen] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [openAttend, setOpenAttend] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isReject, setIsReject] = useState(false);
    const [planData, setPlanData] = useState({
        period: "",
        interval: 1,
        amount: 1,
        cards: 1
    });
    const [attend, setAttend] = useState({
        status: "",
        reason: "",
    });

    const fetchRequests = async () => {
        setLoading(true);

        const cachedCustomById = window.sessionStorage.getItem('custom_byId');
        if (cachedCustomById) {
            const { data: cachedCustom, expires, id: cachedId } = JSON.parse(cachedCustomById);

            if (Date.now() < expires && cachedId === id) {
                setRequests(cachedCustom);
                setPlanData({
                    period: cachedCustom.period,
                    interval: Number(cachedCustom.interval),
                    amount: Number(cachedCustom.amount),
                    cards: Number(cachedCustom.cards)
                });
                setAttend({
                    status: cachedCustom.accepted,
                    reason: cachedCustom.reason || ""
                });
                setLoading(false);
                return;
            }
        }

        window.sessionStorage.removeItem('custom_byId');

        try {
            const { data }: { data: CustomRequestResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/request/byId/${id}`, { withCredentials: true });
            setRequests(data.request);
            setPlanData({
                period: data.request.period,
                interval: Number(data.request.interval),
                amount: Number(data.request.amount),
                cards: Number(data.request.cards)
            });
            setAttend({
                status: data.request.accepted,
                reason: data.request.reason || ""
            });
            const payload = {
                id,
                data: data.request,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('custom_byId', JSON.stringify(payload));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }

        setLoading(false);
    }

    useEffect(() => {
        fetchRequests();
    }, [id]);

    const handleReject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!attend.reason) {
            toast.warning("Please fill all fields");
            return;
        }

        const payLoad = {
            reason: attend.reason,
            userId: requests?.user?._id
        };

        window.sessionStorage.removeItem('custom_byId');

        try {
            const { data }: { data: CustomRequestResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/request/reject/${id}`, payLoad, { withCredentials: true });
            setRequests(data.request);
            setPlanData({
                period: data.request.period,
                interval: Number(data.request.interval),
                amount: Number(data.request.amount),
                cards: Number(data.request.cards)
            });
            setAttend({
                status: data.request.accepted,
                reason: data.request.reason || ""
            });
            const payload = {
                id,
                data: data.request,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('custom_byId', JSON.stringify(payload));
            toast.success("Request rejected successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }

        setIsReject(false);
        setOpenAttend(false);
    }

    const handleAttend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!attend.status || !attend.reason) {
            toast.warning("Please fill all fields");
            return;
        }

        window.sessionStorage.removeItem('custom_byId');

        try {
            const { data }: { data: CustomRequestResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/request/attend/${id}`, attend, { withCredentials: true });
            setRequests(data.request);
            setPlanData({
                period: data.request.period,
                interval: Number(data.request.interval),
                amount: Number(data.request.amount),
                cards: Number(data.request.cards)
            });
            setAttend({
                status: data.request.accepted,
                reason: data.request.reason || ""
            });
            const payload = {
                id,
                data: data.request,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('custom_byId', JSON.stringify(payload));
            toast.success("Request attended successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }

        setOpenAttend(false);
    }

    const handleAccept = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        for (const [field, value] of Object.entries(planData)) {
            if (!value) {
                toast.warning(`${field} is required`);
                return;
            }
        }

        const payLoad = {
            ...planData,
            userId: requests?.user?._id
        };

        window.sessionStorage.removeItem('custom_byId');

        try {
            const { data }: { data: CustomRequestResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/request/new/${id}`, payLoad, { withCredentials: true });
            setRequests(data.request);
            setPlanData({
                period: data.request.period,
                interval: Number(data.request.interval),
                amount: Number(data.request.amount),
                cards: Number(data.request.cards)
            });
            setAttend({
                status: data.request.accepted,
                reason: data.request.reason || ""
            });
            const payload = {
                id,
                data: data.request,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('custom_byId', JSON.stringify(payload));
            toast.success("Request accepted successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }

        setOpen(false);
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/request/byId/${id}`, { withCredentials: true });
            window.sessionStorage.removeItem('custom_byId');
            toast.success("Card deleted successfully");
            navigate(-1)
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setOpenDel(false);
    }

    return loading ? (
        <Loader />
    ): (
        <DefaultLayout>
            <div className="w-full mt-8 flex flex-col md:flex-row flex-wrap items-center justify-evenly gap-3 space-y-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl text-white underline font-semibold">Request Details</h1>
                    <p className="text-white"><span className="font-semibold">Id:</span> {requests?._id}</p>
                    <p className="text-white"><span className="font-semibold">Email:</span> {requests?.email}</p>
                    <p className="text-white"><span className="font-semibold">Cards:</span> {requests?.cards}</p>
                    <p className="text-white"><span className="font-semibold">Amount:</span> {requests?.amount}</p>
                    <p className="text-white"><span className="font-semibold">Period:</span> {requests?.period}</p>
                    <p className="text-white"><span className="font-semibold">Interval:</span> {requests?.interval}</p>
                    <p className="text-white"><span className="font-semibold">Cards:</span> {requests?.comment}</p>
                    {requests?.accepted === "accepted" ? (
                        <Link to={`/plans/details?id=${requests?.reason}`} className="text-white"><span className="font-semibold">Plan:</span> {requests?.reason}</Link>
                    ) : (
                        <p className="text-white"><span className="font-semibold">Reason:</span> {requests?.reason}</p>
                    )}
                    <Link to={`/users/details?id=${requests?.user?._id}`} className="text-white"><span className="font-semibold">User:</span> {requests?.user?._id}</Link>
                    <p className="text-white"><span className="font-semibold">Status:</span> {String(requests?.accepted).toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Attended:</span> {String(requests?.attended).toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Request Created</span> - {String(new Date(requests?.createdAt!).toDateString())}</p>
                </div>

                {openDel && (
                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 w-[90%] md:w-[50%] lg:w-[30%]">
                            <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Are you sure you want to deactivate this request?</h2>
                            <div className="w-full mt-8 flex justify-between items-center gap-8">
                                <button className="w-1/2 px-3 py-2 border-2 border-red-500 rounded-lg bg-red-500 text-white" onClick={handleDelete}>
                                    Yes, I am sure!!
                                </button>
                                <button className="w-1/2 px-3 py-2 border-2 text-white rounded-lg" onClick={() => setOpenDel(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <button disabled={requests?.attended} onClick={() => setOpen(true)} className="flex w-full justify-center rounded bg-green-500 p-3 font-medium text-gray hover:bg-opacity-90">
                        Accept Request
                    </button>
                    <button 
                        disabled={requests?.attended}
                        onClick={() => {
                            setOpenAttend(true)
                            if (isReject) {
                                setIsReject(false);
                                setAttend({ ...attend, status: ""});
                            }
                        }} 
                        className="flex w-full justify-center rounded bg-indigo-500 p-3 font-medium text-gray hover:bg-opacity-90"
                    >
                        Attend Request
                    </button>
                    <button
                        disabled={requests?.attended}
                        onClick={() => {
                            setOpenAttend(true);
                            if (!isReject) {
                                setIsReject(true);
                                setAttend({ ...attend, status: "rejected"});
                            }
                        }}
                        className="flex w-full justify-center rounded bg-orange-500 p-3 font-medium text-gray hover:bg-opacity-90"
                    >
                        Reject Request
                    </button>
                    <button
                        onClick={() => setOpenDel(true)}
                        className="flex w-full justify-center rounded bg-red-500 p-3 font-medium text-gray hover:bg-opacity-90"
                    >
                        Delete Request
                    </button>
                </div>
                {open && (
                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 w-[90%] md:w-[70%] lg:w-[50%]">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold mb-4 flex justify-center text-black dark:text-white">Create Custom Plan</h2>
                                <button className="px-3 py-2 border-2 rounded-lg" onClick={() => setOpen(false)}>Close</button>
                            </div>
                            <form onSubmit={handleAccept} className="flex flex-col gap-2">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="amount" className="text-lg font-semibold text-black dark:text-white">Amount</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={planData.amount}
                                        onChange={(e) => setPlanData({ ...planData, amount: Number(e.target.value) })}
                                        placeholder="Enter plan amount"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="cards" className="text-lg font-semibold text-black dark:text-white">Cards</label>
                                    <input
                                        type="number"
                                        name="cards"
                                        value={planData.cards}
                                        onChange={(e) => setPlanData({ ...planData, cards: Number(e.target.value) })}
                                        placeholder="Enter plan cards"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="interval" className="text-lg font-semibold text-black dark:text-white">Interval</label>
                                    <input
                                        type="number"
                                        name="interval"
                                        value={planData.interval}
                                        onChange={(e) => setPlanData({ ...planData, interval: Number(e.target.value) })}
                                        placeholder="Enter plan interval"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="period" className="text-lg font-semibold text-black dark:text-white">Period</label>
                                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                                        <select
                                            name="period"
                                            value={planData.period}
                                            onChange={(e) => setPlanData({ ...planData, period: e.target.value })}
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

                                <button type="submit" className="mt-4 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {openAttend && (
                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 w-[90%] md:w-[70%] lg:w-[50%]">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold mb-4 flex justify-center text-black dark:text-white">{isReject ? "Reject" : "Attend"} Request</h2>
                                <button className="px-3 py-2 border-2 rounded-lg" onClick={() => {
                                    setOpenAttend(false);
                                    if (isReject) {
                                        setIsReject(false);
                                        setAttend({ ...attend, status: ""});
                                    }
                                }}>Close</button>
                            </div>
                            <form onSubmit={isReject ? handleReject : handleAttend} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="status" className="text-lg font-semibold text-black dark:text-white">Status</label>
                                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                                        <select
                                            name="status"
                                            value={attend.status}
                                            disabled={isReject}
                                            onChange={(e) => setAttend({ ...attend, status: e.target.value })}
                                            className={`w-full rounded appearance-none border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                                        >
                                            <option value="" className="text-body dark:text-bodydark">
                                                Choose Period
                                            </option>
                                            <option value="pending" className="text-body dark:text-bodydark">
                                                PENDING
                                            </option>
                                            <option value="accepted" className="text-body dark:text-bodydark">
                                                ACCEPTED
                                            </option>
                                            <option value="rejected" className="text-body dark:text-bodydark">
                                                REJECTED
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

                                <div className="flex flex-col gap-4">
                                    <label htmlFor="reason" className="text-lg font-semibold text-black dark:text-white">Reason</label>
                                    <textarea
                                        rows={3}
                                        name="reason"
                                        value={attend.reason}
                                        onChange={(e) => setAttend({ ...attend, reason: e.target.value })}
                                        placeholder="Write a Reason"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    ></textarea>
                                </div>

                                <button type="submit" className="mt-4 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    )
}

export default CustomDetails;