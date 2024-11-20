import { useNavigate, useSearchParams } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import { Transaction } from "../../types/types";
import { useEffect, useState } from "react";
import { TransactionResponse } from "../../types/api-types";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const TransactionDetails = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const [transaction, setTransaction] = useState<Transaction>();
    const [status, setStatus] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchTransaction = async () => {
        setLoading(true);

        const cachedTransacById = window.sessionStorage.getItem('transac_byId');
        if (cachedTransacById) {
            const { data: cachedTransac, expires, id: cachedId } = JSON.parse(cachedTransacById);

            if (Date.now() < expires && cachedId === id) {
                setTransaction(cachedTransac);
                setStatus(cachedTransac.status);
                setLoading(false);
                return;
            }
        }

        window.sessionStorage.removeItem('transac_byId');

        try {
            const { data }: { data: TransactionResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/transac/byId/${id}`, { withCredentials: true });
            setTransaction(data.transaction);
            setStatus(data.transaction.status);
            const payload = {
                id,
                data: data.transaction,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('transac_byId', JSON.stringify(payload));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchTransaction();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/transac/byId/${id}`, { withCredentials: true });
            window.sessionStorage.removeItem('transac_byId');
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
        if (status === transaction?.status) {
            toast.warning(`Status is already ${status}`);
            return;
        }

        window.sessionStorage.removeItem('transac_byId');

        try {
            const { data }: { data: TransactionResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/transac/byId/${id}`, { status }, { withCredentials: true });
            setTransaction(data.transaction);
            setStatus(data.transaction.status);
            const payload = {
                id,
                data: data.transaction,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('transac_byId', JSON.stringify(payload));
            toast.success("Subscription status updated successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return loading ? (
        <Loader />
    ): (
        <DefaultLayout>
            <div className="flex flex-wrap items-center justify-evenly gap-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl text-white underline font-semibold">Transactions Details</h1>
                    <p className="text-white"><span className="font-semibold">Id:</span> {transaction?._id}</p>
                    <p className="text-white"><span className="font-semibold">Order Id:</span> {transaction?.razorpayOrderId}</p>
                    <p className="text-white"><span className="font-semibold">Payment Id:</span> {transaction?.razorpayPaymentId}</p>
                    <p className="text-white"><span className="font-semibold">Amount:</span> {transaction?.currency === "INR" ? "₹" : "$"} {transaction?.amount}</p>
                    <p className="text-white"><span className="font-semibold">Currency:</span> {transaction?.currency}</p>
                    <p className="text-white"><span className="font-semibold">Period:</span> {String(new Date(transaction?.start!).toDateString())} - {String(new Date(transaction?.end!).toDateString())}</p>
                    <p className="text-white"><span className="font-semibold">Status:</span> {transaction?.status.toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Type:</span> {transaction?.transactionType.toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">For:</span> {transaction?.transactionFor.toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Payment Method:</span> {transaction?.paymentMethod?.methodType}</p>
                    {(transaction?.error?.error_code || transaction?.error?.error_description || transaction?.error?.error_source || transaction?.error?.error_step || transaction?.error?.error_reason) && (
                        <>
                            <p className="text-red-500"><span className="font-semibold">Error Code:</span> {transaction?.error?.error_code}</p>
                            <p className="text-red-500"><span className="font-semibold">Error Description:</span> {transaction?.error?.error_description}</p>
                            <p className="text-red-500"><span className="font-semibold">Error Source:</span> {transaction?.error?.error_source}</p>
                            <p className="text-red-500"><span className="font-semibold">Error Step:</span> {transaction?.error?.error_step}</p>
                            <p className="text-red-500"><span className="font-semibold">Error Reason:</span> {transaction?.error?.error_reason}</p>
                        </>
                    )}
                    <p className="text-white"><span className="font-semibold">Payment Details:</span> {transaction?.paymentMethod?.methodType === "card" ? `${transaction?.paymentMethod?.cardInfo?.name} ${transaction?.paymentMethod?.cardInfo?.cardType} ${transaction?.paymentMethod?.cardInfo?.last4}` : (transaction?.paymentMethod?.bankInfo || transaction?.paymentMethod?.upiInfo || transaction?.paymentMethod?.walletInfo)}</p>
                    <p className="text-white"><span className="font-semibold">{transaction?.transactionFor === "user" ? "User" : "Donator"}:</span> {transaction?.transactionFor === "user" ? transaction?.user : transaction?.donator}</p>
                    <p className="text-white"><span className="font-semibold">Subscription Created</span> - {String(new Date(transaction?.createdAt!).toDateString())}</p>
                    <p className="text-white"><span className="font-semibold">Subscription Upadated</span> - {String(new Date(transaction?.updatedAt!).toDateString())}</p>
                </div>

                {open && (
                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 w-[90%] md:w-[50%] lg:w-[30%]">
                            <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Are you sure you want to deactivate this transaction?</h2>
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
                            <option value="created">CREATED</option>
                            <option value="authorized">AUTHORIZED</option>
                            <option value="captured">CAPTURED</option>
                            <option value="refunded">REFUNDED</option>
                            <option value="failed">FAILED</option>
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

export default TransactionDetails;