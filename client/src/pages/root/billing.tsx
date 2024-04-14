import axios from "axios";
import { useEffect, useState } from "react";

interface Transaction {
    amount: Number;
    start: Date;
    end: Date;
    status: String;
    razorpayOrderId: String;
    razorpayPaymentId: String;
    paymentMethod: any;
    user: String;
}

const BillingPage = () => {

    const [transactions, setTransactions] = useState<Transaction[] | undefined>();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/sub/transactions/user`, { withCredentials: true });
                setTransactions(data.transactions);
            } catch (error) {
                console.log(error);
            }
        }
        fetchTransactions();
    }, []);
    return (
        <div>
            {transactions?.map((transaction, index) => (
                <div key={index}>
                    <p>{transaction.amount.toString()}</p>
                </div>
            ))}
        </div>
    )
}

export default BillingPage;