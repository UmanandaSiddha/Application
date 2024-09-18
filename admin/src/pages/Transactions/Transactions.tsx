import { toast } from 'react-toastify';
import DefaultLayout from '../../layout/DefaultLayout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '../../types/types';
import axios from 'axios';
import { AllTransactionsResponse } from '../../types/api-types';

const Transactions = () => {

    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>();
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredTransactions: 1,
        totalTransactions: 1
    });

    const fetchTransactions = async (url: string) => {
        try {
            const { data }: { data: AllTransactionsResponse } = await axios.get(url, { withCredentials: true });
            setTransactions(data.transactions);
            setCounts({
                ...counts,
                resultPerPage: data.resultPerPage,
                filteredTransactions: data.filteredTransactionsCount,
                totalTransactions: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        let link = `${import.meta.env.VITE_BASE_URL}/admin/transac/all?page=${counts.currentPage}`;
        fetchTransactions(link);
    }, [counts.currentPage]);


    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Transactions
                        </h4>
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage - 1 })}
                                disabled={counts.currentPage === 1}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Prev
                            </button>
                            <p className="text-md font-semibold truncate">{counts.currentPage} / {Math.ceil(counts.filteredTransactions / counts.resultPerPage)}</p>
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
                                disabled={counts.currentPage === Math.ceil(counts.filteredTransactions / counts.resultPerPage)}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                        <div className="col-span-2 flex items-center">
                            <p className="font-medium">Period</p>
                        </div>
                        <div className="col-span-1 hidden items-center sm:flex">
                            <p className="font-medium">Date</p>
                        </div>
                        <div className="col-span-1 hidden items-center sm:flex">
                            <p className="font-medium">For</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Amount</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Status</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Method</p>
                        </div>
                        <div className="col-span-1 hidden items-center sm:flex">
                            <p className="font-medium">Type</p>
                        </div>
                    </div>

                    {transactions?.map((transac, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/transaction-details?id=${transac._id}`)}
                        >
                            <div className="col-span-2 flex items-center">
                                <p className="text-sm text-black dark:text-white">{String(new Date(transac.start).toLocaleDateString())} - {String(new Date(transac.end).toLocaleDateString())}</p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {String(new Date(transac.createdAt).toLocaleDateString())}
                                </p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {transac.transactionFor.toUpperCase()}
                                </p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{transac.currency === "INR" ? "₹" : "$"} {transac.amount}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{transac.status.toUpperCase()}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{transac?.paymentMethod?.methodType?.toUpperCase()}</p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="text-sm text-meta-3">
                                    {transac.transactionType.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Transactions;