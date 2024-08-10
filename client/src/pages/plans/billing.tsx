import axios from "axios";
import { useEffect, useState } from "react";
import { Subscription, Transaction } from "@/types/plan_types";
import { SubscriptionResponse } from "@/types/api-types";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

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
        <div className="dark:bg-gray-900">
            <div className="container px-6 py-8 mx-auto">
                <div className="mt-6 space-y-8 xl:mt-12">

                    <h1 className="text-3xl text-center font-semibold">Current Subscription</h1>

                    <div className="flex flex-col md:flex-row gap-2 items-center justify-between max-w-4xl px-12 py-6 mx-auto bg-white cursor-pointer shadow-xl rounded-xl">
                        <div className="flex flex-col justify-center gap-2">
                            <h1 className="text-2xl font-semibold underline">Subscription Id: 468748465123178744534</h1>
                            <p className="text-md font-semibold">Service Period: <span className="text-gray-500">7/10/24 - 7/12/24</span></p>
                            <p className="text-md font-semibold">Next Billing: <span className="text-gray-500">7/11/24</span></p>
                            <p className="text-md font-semibold">Payment Method: <span className="text-gray-500">Credit Card **** **** **** 1254</span></p>
                            <p className="text-md font-semibold">Razoray Link: <span className="italic underline text-gray-500">http:rzpy.com/api/sub/45867891221564</span></p>
                            <p className="text-sm italic text-gray-500">( Recommended for changing payment method)</p>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-4">
                            <h1 className="text-2xl font-semibold">Status: <span className="text-blue-500">Active</span></h1>
                            <button className="border-2 border-red-500 text-red-500 font-semibold rounded-lg px-3 py-2">Cancel Subscription</button>
                        </div>
                    </div>

                    <h1 className="text-3xl text-center font-semibold">Transactions</h1>

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
                        <div key={item} className="flex items-center justify-between max-w-4xl px-12 py-6 mx-auto bg-white cursor-pointer shadow-xl rounded-xl">
                            <div className="flex flex-col justify-center gap-1">
                                <p className="text-md font-semibold">Date: 7/11/24</p>
                                <p className="text-md font-semibold">Service Period: 7/11/24 - 7/12/24</p>
                                <p className="text-md font-semibold">Payment Method: Credit Card **** **** **** 1254</p>
                            </div>
                            <div className="flex flex-col justify-center gap-1">
                                <p className="text-md font-semibold">Status: Captured</p>
                                <p className="text-md font-semibold">Amount: 100</p>
                                <Link to="/receipt" className="text-md underline">Go To Reciept</Link>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default BillingPage;
