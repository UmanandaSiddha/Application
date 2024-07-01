import axios from "axios";
import { useEffect, useState } from "react";
import { Subscription, Transaction } from "@/types/plan_types";
import { SubscriptionResponse } from "@/types/api-types";
import { toast } from "react-toastify";

const BillingPage = () => {

    const [subscription, setSubscription] = useState<Subscription | null>();
    const [transactions, setTransactions] = useState<Transaction[] | undefined>();

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
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/sub/transactions/all`, { withCredentials: true });
            setTransactions(data.transactions);
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
                window.localStorage.removeItem("latest_sub");
                fetchSubscription();
            } else {
                setSubscription(JSON.parse(subData).data);
            }
        } else {
            fetchSubscription();
        }
        if (transactionData) {
            if (JSON.parse(transactionData)?.created < Date.now()) {
                window.localStorage.removeItem("transactions");
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
            toast.success("Subscription Cencelled Successfully");
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="bg-white py-1 sm:py-6">
            {subscription && !["just_created", "created"].includes(subscription.status) ? (
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto mt-8 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                        <div className="p-8 sm:p-10 lg:flex-auto">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Current Subscription</h3>
                            <p className="mt-2 text-base leading-7 text-gray-600">
                                Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis
                                repellendus etur quidem assumenda.
                                {/* {subscription.planId.description} */}
                            </p>
                            <div className="mt-3 flex items-center gap-x-4">
                                <h4 className="flex-none text-md font-semibold leading-6">Details</h4>
                                <div className="h-px flex-auto bg-gray-100" />
                            </div>
                            <div
                                className="mt-2 grid grid-cols-1 gap-2 text-sm leading-2 text-gray-600 sm:grid-cols-2 sm:gap-2"
                            >
                                <p className="flex gap-x-3">Service period: {String(new Date(subscription.currentEnd).toDateString())} - {String(new Date(subscription.currentStart).toDateString())}</p>
                                <p className="flex gap-x-3">Next Billing: {String(new Date(subscription.currentEnd).toDateString())}</p>
                                <p className="flex gao-x-3">Payment Method: {subscription?.paymentMethod?.methodType} {subscription?.paymentMethod?.methodType === "card" ? `${subscription?.paymentMethod?.cardInfo?.last4} ${subscription?.paymentMethod?.cardInfo?.cardType}` : subscription?.paymentMethod?.upiInfo || subscription?.paymentMethod?.walletInfo || subscription?.paymentMethod?.bankInfo}</p>
                                <a href={subscription.shortUrl} target="blank" className="flex gap-x-3">Update Payment Method Here: {subscription.shortUrl}</a>
                            </div>
                        </div>
                        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                            <div className="rounded-2xl bg-gray-50 py-6 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-10">
                                <div className="mx-auto max-w-xs px-8">
                                    <p className="text-2xl font-bold text-gray-600">{subscription.planId.name}</p>
                                    <p className="text-xl font-semibold text-green-600">Status: {subscription.status}</p>
                                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                                        <span className="text-5xl font-bold tracking-tight text-gray-900">₹ {subscription.planId.amount}</span>
                                        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">per month</span>
                                    </p>
                                    <button
                                        onClick={() => handleSubscription(subscription?._id)}
                                        className="mt-10 block w-full rounded-md bg-red-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Cancel Subscription
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center mt-16 text-2xl font-semibold">No Subscription here</p>
            )}

            {transactions && transactions.length > 0 ? (
                <div className="mx-auto my-16 max-w-7xl px-6 lg:px-8 mt-16">
                    <div className="flex justify-between items-center px-10 py-2">
                        <h1 className="text-2xl font-semibold">Transactions</h1>
                        <div className="inline-flex space-x-4 items-center">
                            <button className="px-4 py-1 bg-black text-white rounded-md">Prev</button>
                            <p className="text-md font-semibold">1/10</p>
                            <button className="px-4 py-1 bg-black text-white rounded-md">Next</button>
                        </div>
                    </div>
                    <div className="mx-auto mt-2 max-w-6xl rounded-2xl ring-1 ring-gray-200">
                        {transactions && (
                            <div className="flex flex-col">
                                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                        <div className="overflow-hidden">
                                            <table className="min-w-full text-left text-sm font-light">
                                                <thead className="border-b font-medium dark:border-neutral-500">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-4">Payment Id</th>
                                                        <th scope="col" className="px-6 py-4">Amount</th>
                                                        <th scope="col" className="px-6 py-4">Period</th>
                                                        <th scope="col" className="px-6 py-4">Status</th>
                                                        <th scope="col" className="px-6 py-4">Payment Method</th>
                                                        <th scope="col" className="px-6 py-4">Payment Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transactions.map((transaction: Transaction, index: number) => (
                                                        <tr key={index} className="border-b dark:border-neutral-500">
                                                            <td className="whitespace-nowrap px-6 py-4 font-medium">{transaction.razorpayPaymentId}</td>
                                                            <td className="whitespace-nowrap px-6 py-4">{transaction.amount}</td>
                                                            <td className="whitespace-nowrap px-6 py-4">{String(new Date(transaction.end).toDateString())} - {String(new Date(transaction.start).toDateString())}</td>
                                                            <td className="whitespace-nowrap px-6 py-4">{transaction.status}</td>
                                                            <td className="whitespace-nowrap px-6 py-4">{transaction.paymentMethod.methodType}</td>
                                                            <td className="whitespace-nowrap px-6 py-4">{String(new Date(transaction.createdAt).toDateString())}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-center mt-16 text-2xl font-semibold">No Transactions here</p>
            )}
        </div>
    );
};

export default BillingPage;
