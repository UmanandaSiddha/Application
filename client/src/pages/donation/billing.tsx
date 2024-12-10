import { SubscriptionResponse } from "@/types/api-types";
import { Subscription, Transaction } from "@/types/plan_types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiMiniArrowSmallRight } from "react-icons/hi2";
import { HiMiniArrowSmallLeft } from "react-icons/hi2";
import { Helmet } from "react-helmet-async";

export type AllTransactionsResponse = {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredTransactionCount: number;
    transactions: Transaction[];
}

const DonationBilling = () => {

    const [subscription, setSubscription] = useState<Subscription | null>();
    const [transactions, setTransactions] = useState<Transaction[]>();
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredTransactions: 1,
        totalTransactions: 1
    });

    const fetchSubscription = async () => {
        try {
            const { data }: { data: SubscriptionResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/donate/subcription/latest`, { withCredentials: true });
            setSubscription(data.subscription);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const { data }: { data: AllTransactionsResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/donate/transaction/all?page=${counts.currentPage}`, { withCredentials: true });
            setTransactions(data.transactions);
            setCounts({
                ...counts,
                resultPerPage: data.resultPerPage,
                filteredTransactions: data.filteredTransactionCount,
                totalTransactions: data.count
            });
        } catch (error) {
            console.log(error);
            setTransactions([]);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [counts.currentPage]);

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
        <>
            <Helmet>
                <title>Voolata | Donation Billing</title>
                <meta name="description" content={`This is the donation billing page of Voolata`} />
                <meta name="keywords" content="donation billing, voolata" />
            </Helmet>
            <div className="dark:bg-gray-900">
                <div className="container px-6 py-8 mx-auto">
                    <div className="mt-6 space-y-8 xl:mt-12">

                        <h1 className="text-3xl text-center font-semibold">Recurring Donation</h1>

                        {subscription && !["just_created", "created"].includes(subscription.status) ? (
                            <div className="flex flex-col md:flex-row gap-2 items-center justify-between max-w-4xl px-12 py-6 mx-auto bg-white cursor-pointer shadow-xl rounded-xl">
                                <div className="flex flex-col justify-center gap-1">
                                    <h1 className="text-xl font-semibold underline">Subscription Id: {subscription._id}</h1>
                                    <p className="text-md font-semibold">Service Period: <span className="text-gray-500">{String(new Date(subscription.currentEnd).toDateString())} - {String(new Date(subscription.currentStart).toDateString())}</span></p>
                                    <p className="text-md font-semibold">Next Billing: <span className="text-gray-500">{String(new Date(subscription.currentEnd).toDateString())}</span></p>
                                    <p className="text-md font-semibold">Payment Method: <span className="text-gray-500">{subscription?.paymentMethod?.methodType.toUpperCase()}</span></p>
                                    <p className="text-md font-semibold">Payment Details: <span className="text-gray-500">{subscription?.paymentMethod?.methodType === "card" ? `${subscription?.paymentMethod?.cardInfo?.name} ${subscription?.paymentMethod?.cardInfo?.cardType} ${subscription?.paymentMethod?.cardInfo?.last4}` : (subscription?.paymentMethod?.bankInfo || subscription?.paymentMethod?.upiInfo || subscription?.paymentMethod?.walletInfo)}</span></p>
                                    <p className="text-md font-semibold">Razoray Link: <Link to={subscription.shortUrl} target="blank" className="italic underline text-gray-500">{subscription.shortUrl}</Link></p>
                                    <p className="text-sm italic text-gray-500">( Recommended for changing payment method)</p>
                                </div>
                                <div className="mt-4 md:mt-0 flex flex-col justify-center items-center gap-4">
                                    <h1 className="text-2xl font-semibold">Status: <span className="text-blue-500">{subscription.status}</span></h1>
                                    <button onClick={() => handleSubscription(subscription?._id)} className="border-2 border-red-500 text-red-500 font-semibold rounded-lg px-3 py-2">Cancel Subscription</button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-4 max-w-4xl px-12 py-6 mx-auto bg-white cursor-pointer shadow-xl rounded-xl">
                                <p className="text-2xl font-semibold">No Recurring Donation</p>
                                <Link to="/donation/checkout" className="text-lg text-purple-600 font-semibold hover:underline">Donate Now</Link>
                            </div>
                        )}

                        {transactions && transactions.length > 0 && (
                            <>
                                <div className="flex flex-col md:flex-row justify-between px-16">
                                    <h1 className="text-3xl text-center font-semibold">Donations  ({counts.filteredTransactions})</h1>
                                    <div className='mt-4 md:mt-0 flex justify-center items-center gap-6'>
                                        <button
                                            onClick={() => setCounts({ ...counts, currentPage: counts.currentPage - 1 })}
                                            disabled={counts.currentPage === 1}
                                            className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8"
                                        >
                                            <HiMiniArrowSmallLeft size={25} />
                                        </button>
                                        <p className="text-lg font-semibold truncate">
                                            {counts.currentPage} / {Math.ceil(counts.filteredTransactions / counts.resultPerPage)}
                                        </p>
                                        <button
                                            onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
                                            disabled={counts.currentPage === Math.ceil(counts.filteredTransactions / counts.resultPerPage)}
                                            className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8"
                                        >
                                            <HiMiniArrowSmallRight size={25} />
                                        </button>
                                    </div>
                                </div>

                                {transactions.map((transaction, index) => (
                                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between max-w-4xl px-12 py-6 mx-auto bg-white cursor-pointer shadow-xl rounded-xl">
                                        <div className="flex flex-col justify-center gap-1">
                                            <p className="text-md font-semibold">Donation Type - <span className="text-red-500">{transaction.transactionType.toUpperCase()}</span></p>
                                            <p className="text-md font-semibold">Date: {String(new Date(transaction.createdAt).toDateString())}</p>
                                            {transaction.transactionType === "recurring" && (
                                                <p className="text-md font-semibold">Service Period: {String(new Date(transaction.end).toDateString())} - {String(new Date(transaction.start).toDateString())}</p>
                                            )}
                                            <p className="text-md font-semibold">Payment Method: {transaction.paymentMethod?.methodType.toUpperCase()}</p>
                                            <p className="text-md font-semibold">Payment Id: {transaction.razorpayPaymentId}</p>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex flex-col justify-center gap-1">
                                            <p className="text-md font-semibold">Payment Details: <span className="text-blue-500">{transaction?.paymentMethod?.methodType === "card" ? `${transaction?.paymentMethod?.cardInfo?.name} ${transaction?.paymentMethod?.cardInfo?.cardType} ${transaction?.paymentMethod?.cardInfo?.last4}` : (transaction?.paymentMethod?.bankInfo || transaction?.paymentMethod?.upiInfo || transaction?.paymentMethod?.walletInfo)}</span></p>
                                            <p className="text-md font-semibold">Status: <span className="text-green-500">{transaction.status}</span></p>
                                            <p className="text-md font-semibold">Amount: {transaction.amount}</p>
                                            <Link to={`/receipt/donate/${transaction._id}`} className="text-md underline">Go To Reciept</Link>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </>
    )
}

export default DonationBilling;