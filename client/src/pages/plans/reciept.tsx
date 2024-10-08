import Loader from "@/components/rest/loader";
import "@/css/print.css";
import { RootState } from "@/redux/store";
import { Transaction } from "@/types/plan_types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const RecieptPage = () => {

    const [search] = useSearchParams();
    const id = search.get("id");
    const type = search.get("type");
    const [transaction, setTransaction] = useState<Transaction | null>();
    const { donator } = useSelector((state: RootState) => state.donatorReducer);
    const [reciept, setReciept] = useState(false);

    const fetchTransaction = async () => {
        try {
            let link;
            if (type === "user") {
                link = `${import.meta.env.VITE_BASE_URL}/sub/transaction/${id}`;
            } else {
                link = `${import.meta.env.VITE_BASE_URL}/donate/transaction/${id}`
            }
            const { data } = await axios.get(link, { withCredentials: true });
            setTransaction(data.transaction);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        fetchTransaction();
    }, [id, type]);

    return (!id || !transaction) ? <Loader /> : (
        <div className="h-[85vh] w-[80%] mx-auto">
            <div className="w-full flex flex-col md:flex-row justify-center items-center p-2 gap-4">
                <div className="w-full md:w-1/2 flex flex-col">
                    <h1 className="text-3xl font-semibold underline">Transaction Details</h1>
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">Id: {transaction?._id}</h2>
                        <p>Amount: {transaction.currency === "INR" ? "₹" : "$"} {transaction?.amount}</p>
                        <p>Period: {String(new Date(transaction?.start).toDateString())} - {String(new Date(transaction?.end).toDateString())}</p>
                        <p>Status: {transaction.status.toUpperCase()}</p>
                        <p>Payment Id: {transaction.razorpayPaymentId}</p>
                        <p>Order Id: {transaction.razorpayOrderId}</p>
                        <p>Currency: {transaction.currency.toUpperCase()}</p>
                        <p>Payment Method: {transaction.paymentMethod?.methodType.toUpperCase()}</p>
                        {type === "donate" && donator?.pan && (
                            <div className="flex justify-center items-center h-full w-full mt-3">
                                <div className="inline-flex justify-center items-center border-2 border-blue-500 shadow-x rounded-lg">
                                    <button
                                        className={`px-4 py-2 ${reciept ? "bg-blue-500 text-white rounded-md" : "text-blue-500"}`}
                                        onClick={() => {
                                            setReciept(prev => !prev);
                                        }}
                                    >
                                        80g Receipt
                                    </button>
                                    <button
                                        className={`px-4 py-2 ${!reciept ? "bg-blue-500 text-white rounded-md" : "text-blue-500"}`}
                                        onClick={() => {
                                            setReciept(prev => !prev);
                                        }}
                                    >
                                        Invoice
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full md:w-1/2 bg-white flex flex-col printable py-6 px-3 gap-2">
                    <div className="flex flex-col">
                        <h1 className="mt-6 text-3xl font-semibold text-indigo-600 text-center">Voolata Pvt Ltd</h1>
                        {type === "donate" && donator?.pan && (
                            <h2 className="mt-2 text-2xl font-semibold text-center">{reciept ? "80g Receipt" : "Invoice"}</h2>
                        )}
                        <div className="mt-6 px-4">
                            <h2 className="text-xl font-semibold">Premium Delux Plan</h2>
                            <p className="text-sm">description of this delux plan which is good</p>
                            <p className="text-sm">Amount: ₹ 101</p>
                            <p className="text-sm">Next due on 3 Oct 2024</p>
                        </div>
                        <div className="mt-6 px-4">
                            <h2 className="text-xl font-semibold">Payment Details</h2>
                            <p className="text-sm">Payment ID: OsP9778XimvThh</p>
                            <p className="text-sm">Paid on 3 Sep 2024 00:26:43</p>
                        </div>
                        <div className="mt-6 px-4">
                            <h2 className="text-xl font-semibold">Bill Date</h2>
                            <p className="text-sm">3 Sep 2024</p>
                        </div>
                        <div className="mt-6 px-4">
                            <h2 className="text-xl font-semibold">Payment Method</h2>
                            <p className="text-sm">UPI *********azorpay</p>
                        </div>
                        <div className="mt-6 px-4">
                            <p className="text-sm">You may contact Shivaji for any query related to this subscription with the subscription ID as sub_OsPKqVufRVCZJj</p>
                        </div>
                    </div>
                    <button className="my-8 not px-4 py-1 bg-indigo-500 text-white rounded-full cursor-pointer hover:bg-indigo-400 self-center" onClick={() => window.print()}>Print</button>
                </div>
            </div>
        </div>
    )
}

export default RecieptPage;