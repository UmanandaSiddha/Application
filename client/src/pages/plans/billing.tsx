import axios from "axios";
import { useEffect, useState } from "react";
import { Subscription, Transaction } from "@/types/plan_types";
import { SubscriptionResponse } from "@/types/api-types";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { HiMiniArrowSmallRight } from "react-icons/hi2";
import { HiMiniArrowSmallLeft } from "react-icons/hi2";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const BillingPage = () => {

    const [subscription, setSubscription] = useState<Subscription | null>();
    const [transactions, setTransactions] = useState<Transaction[] | undefined>();
    const { user } = useSelector((state: RootState) => state.userReducer);

    const fetchSubscription = async () => {
        try {
            const { data }: { data: SubscriptionResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/sub/subscription/latest`, { withCredentials: true });
            setSubscription(data.subscription);
            const chachedSubscription = {
                created: Date.now() + 30 * 1000,
                data: data.subscription,
            }
            window.sessionStorage.setItem("latest_sub", JSON.stringify(chachedSubscription));
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/sub/transactions/all?page=1`, { withCredentials: true });
            setTransactions(data.filteredTransaction);
            const chachedTransaction = {
                created: Date.now() + 30 * 1000,
                data: data.transactions,
            }
            window.sessionStorage.setItem("transactions", JSON.stringify(chachedTransaction));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const subData = window.sessionStorage.getItem("latest_sub");
        const transactionData = window.sessionStorage.getItem("transactions");
        if (subData) {
            if (JSON.parse(subData)?.created < Date.now()) {
                window.sessionStorage.removeItem("latest_sub");
                fetchSubscription();
            } else {
                setSubscription(JSON.parse(subData).data);
            }
        } else {
            fetchSubscription();
        }
        if (transactionData) {
            if (JSON.parse(transactionData)?.created < Date.now()) {
                window.sessionStorage.removeItem("transactions");
                fetchTransactions();
            } else {
                setTransactions(JSON.parse(transactionData).data);
            }
        } else {
            fetchTransactions();
        }
    }, []);

    const handleSubscription = async (id: string) => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/sub/cancel/${id}`, { withCredentials: true });
            window.sessionStorage.removeItem("latest_sub");
            toast.success("Subscription Cencelled Successfully");
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="dark:bg-gray-900">
            <div className="container px-6 py-8 mx-auto">
                <div className="mt-6 space-y-8 xl:mt-12">

                    <h1 className="text-3xl text-center font-semibold">Current Subscription</h1>

                    {user?.freePlan.status ? (
                        <div className="flex flex-col md:flex-row gap-2 items-center justify-between max-w-4xl px-12 py-6 mx-auto bg-white cursor-pointer shadow-xl rounded-xl">
                        <div className="flex flex-col justify-center gap-2">
                            <h1 className="text-xl font-semibold underline">FREE PLAN</h1>
                            <p className="text-md font-semibold">Period: <span className="text-gray-500">{String(new Date(user.freePlan.start).toDateString())} - {String(new Date(user.freePlan.end).toDateString())}</span></p>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col justify-center items-center gap-4">
                            <h1 className="text-2xl font-semibold">Status: <span className="text-blue-500">{user.freePlan.status ? "Active" : "Ended"}</span></h1>
                        </div>
                    </div>
                    ) : (
                        <>
                            {subscription && !["just_created", "created"].includes(subscription.status) ? (
                                <div className="flex flex-col md:flex-row gap-2 items-center justify-between max-w-4xl px-12 py-6 mx-auto bg-white cursor-pointer shadow-xl rounded-xl">
                                    <div className="flex flex-col justify-center gap-2">
                                        <h1 className="text-xl font-semibold underline">Subscription Id: {subscription._id}</h1>
                                        <p className="text-md font-semibold">Service Period: <span className="text-gray-500">{String(new Date(subscription.currentEnd).toDateString())} - {String(new Date(subscription.currentStart).toDateString())}</span></p>
                                        <p className="text-md font-semibold">Next Billing: <span className="text-gray-500">{String(new Date(subscription.currentEnd).toDateString())}</span></p>
                                        <p className="text-md font-semibold">Payment Method: <span className="text-gray-500">{subscription?.paymentMethod?.methodType} **** **** **** 1254</span></p>
                                        <p className="text-md font-semibold">Razoray Link: <Link to={subscription.shortUrl} className="italic underline text-gray-500">{subscription.shortUrl}</Link></p>
                                        <p className="text-sm italic text-gray-500">( Recommended for changing payment method)</p>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex flex-col justify-center items-center gap-4">
                                        <h1 className="text-2xl font-semibold">Status: <span className="text-blue-500">{subscription.status}</span></h1>
                                        <button onClick={() => handleSubscription(subscription?._id)} className="border-2 border-red-500 text-red-500 font-semibold rounded-lg px-3 py-2">Cancel Subscription</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center mt-16 text-2xl font-semibold">No Subscription here</p>
                            )}
                        </>
                    )}
                    

                    {transactions && transactions.length > 0 && (
                        <>
                            <div className="flex flex-col md:flex-row justify-between px-16">
                                <h1 className="text-3xl text-center font-semibold">Transactions</h1>
                                <div className='mt-4 md:mt-0 flex justify-center items-center gap-6'>
                                    <button onClick={() => {}} className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8">
                                        <HiMiniArrowSmallLeft size={25} />
                                    </button>
                                    <p className="text-lg font-semibold">1 / 10</p>
                                    <button onClick={() => {}} className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8">
                                        <HiMiniArrowSmallRight size={25} />
                                    </button>
                                </div>
                            </div>

                            {transactions.map((transaction, index) => (
                                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between max-w-4xl px-12 py-6 mx-auto bg-white cursor-pointer shadow-xl rounded-xl">
                                    <div className="flex flex-col justify-center gap-1">
                                        <p className="text-md font-semibold">Date: {String(new Date(transaction.createdAt).toDateString())}</p>
                                        <p className="text-md font-semibold">Service Period: {String(new Date(transaction.end).toDateString())} - {String(new Date(transaction.start).toDateString())}</p>
                                        <p className="text-md font-semibold">Payment Method: {transaction.paymentMethod.methodType} **** **** **** 1254</p>
                                        <p className="text-md font-semibold">Payment Id: {transaction.razorpayPaymentId}</p>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex flex-col justify-center gap-1">
                                        <p className="text-md font-semibold">Status: <span className="text-green-500">{transaction.status}</span></p>
                                        <p className="text-md font-semibold">Amount: {transaction.amount}</p>
                                        <Link to={`/receipt?type=user&id=${transaction._id}`} className="text-md underline">Go To Reciept</Link>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default BillingPage;
