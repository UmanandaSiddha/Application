import axios from "axios";
import { useEffect, useState } from "react";
import { Subscription, Transaction } from "@/types/types";

const BillingPage = () => {

    const [transactions, setTransactions] = useState<Transaction[] | undefined>();
    const [subscription, setSubscription] = useState<Subscription | undefined>();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/sub/transactions/user`, { withCredentials: true });
                setTransactions(data.transactions);
            } catch (error) {
                console.log(error);
            }
        }
        const fetchSubscription = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/sub/subscription/user`, { withCredentials: true });
                setSubscription(data.subscription);
            } catch (error) {
                console.log(error);
            }
        }
        fetchSubscription();
        fetchTransactions();
    }, []);

    return (
        <div className='flex flex-col justify-center gap-8 items-center mt-8'>
            <div className="flex gap-2">
                <div>
                    <p>{String(new Date(subscription?.nextBilling!).toDateString())}</p>
                    <p>{subscription?.status}</p>
                    <p>{subscription?.remainingCount}</p>
                </div>
                <button className="border-black border-2 p-2">Cancel</button>
            </div>
            {transactions?.map((transaction, index) => (
                <div key={index}>
                    <p>{transaction.amount.toString()}</p>
                </div>
            ))}
        </div>
    )
}

export default BillingPage;