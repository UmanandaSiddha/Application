import axios from "axios";
import { useEffect, useState } from "react";
import { Transaction } from "@/types/types";
import { useNavigate } from "react-router-dom";

const TransactionComponent = () => {

    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[] | undefined>();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/sub/transactions/user`, { withCredentials: true });
                setTransactions(data.transactions);
                localStorage.setItem("transactions", JSON.stringify(data.transactions));
            } catch (error) {
                console.log(error);
            }
        }
        fetchTransactions();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-semibold">Transactions</h1>
            <div className="w-full flex justify-center">
                <div className="pt-4 w-full flex flex-col justify-center gap-4">
                    {transactions?.map((transaction, index) => (
                        <div
                            className="border-2 border-blue-500 shadow-xl p-2 py-4 rounded-xl w-[90%]"
                            key={index}
                        >
                            <div className="flex flex-row font-Kanit pl-3">
                                <div className="basis-2/5 flex justify-start pl-2">
                                    Status:
                                </div>
                                <div className="basis-3/5 flex justify-start pl-2">
                                    {transaction?.status}
                                </div>
                            </div>
                            <div className="flex flex-row font-Kanit pl-3">
                                <div className="basis-2/5 flex justify-start pl-2">
                                    Amount:
                                </div>
                                <div className="basis-3/5 flex justify-start pl-2">
                                    {transaction?.amount}
                                </div>
                            </div>
                            <div className="flex flex-row font-Kanit pl-3">
                                <div className="basis-2/5 flex justify-start pl-2">
                                    Payment Method:
                                </div>
                                <div className="basis-3/5 flex justify-start pl-2">
                                    {transaction?.paymentMethod.methodType} - {transaction?.paymentMethod.upiInfo}
                                    {transaction.paymentMethod.bankInfo}
                                    {transaction.paymentMethod.walletInfo} 
                                    {transaction.paymentMethod.card?.last4}
                                </div>
                            </div>
                            <div className="flex flex-row font-Kanit pl-3">
                                <div className="basis-2/5 flex justify-start pl-2">
                                    Service Period:
                                </div>
                                <div className="basis-3/5 flex justify-start pl-2">
                                    {String(new Date(transaction?.start!).toDateString())} - {String(new Date(transaction?.end!).toDateString())}
                                </div>
                            </div>
                            <div className="w-full py-3 flex justify-center">
                                <button
                                    onClick={() => navigate(`/receipt?type=user&id=${transaction._id}`)}
                                    className="w-[90%] py-2 bg-blue-500 text-white rounded-sm font-Kanit hover:cursor-pointer hover:bg-blue-400"
                                >
                                    Show Receipt
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TransactionComponent;