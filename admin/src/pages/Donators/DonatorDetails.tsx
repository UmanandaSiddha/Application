import { useNavigate, useSearchParams } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { Donator, Subscription, Transaction } from "../../types/types";
import { AllSubscriptionResponse, AllTransactionsResponse, DonatorResponse } from "../../types/api-types";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const DonatorDetails = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const [donator, setDonator] = useState<Donator>();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>();
    const [transactions, setTransactions] = useState<Transaction[]>();
    const [subscriptionCount, setSubscriptionCount] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredSubscriptions: 1,
        totalSubscriptions: 1
    });
    const [transactionCount, setTransactionCount] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredTransactions: 1,
        totalTransactions: 1
    });
    const [loading, setLoading] = useState(false);
    const [transacLoading, setTransacLoading] = useState(false);
    const [subLoading, setSubLoading] = useState(false);

    const fetchDonator = async () => {
        setLoading(true);

        const cachedDonatorById = window.sessionStorage.getItem('donator_byId');
        if (cachedDonatorById) {
            const { data: cachedDonator, expires, id: cachedId } = JSON.parse(cachedDonatorById);

            if (Date.now() < expires && cachedId === id) {
                setDonator(cachedDonator);
                setLoading(false);
                return;
            }
        }

        window.sessionStorage.removeItem('donator_byId');

        try {
            const { data }: { data: DonatorResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/donator/byId/${id}`, { withCredentials: true });
            setDonator(data.donator);
            const payload = {
                id,
                data: data.donator,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('donator_byId', JSON.stringify(payload));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setLoading(false);
    }

    const fetchTrsanctions = async (url: string) => {
        try {
            const { data }: { data: AllTransactionsResponse } = await axios.get(url, { withCredentials: true });
            setTransactions(data.transactions);
            setTransactionCount({
                ...transactionCount,
                resultPerPage: data.resultPerPage,
                filteredTransactions: data.filteredTransactionsCount,
                totalTransactions: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
            setTransactions([]);
        }
    }

    const fetchSubscriptions = async (url: string) => {
        try {
            const { data }: { data: AllSubscriptionResponse } = await axios.get(url, { withCredentials: true });
            setSubscriptions(data.subscriptions);
            setSubscriptionCount({
                ...subscriptionCount,
                resultPerPage: data.resultPerPage,
                filteredSubscriptions: data.filteredSubscriptionsCount,
                totalSubscriptions: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
            setSubscriptions([]);
        }
    }


    useEffect(() => {
        fetchDonator();
    }, [id]);

    useEffect(() => {
        setTransacLoading(true);

        const delayDebounce = setTimeout(() => {
            let link = `${import.meta.env.VITE_BASE_URL}/admin/transac/donator/${id}?page=${transactionCount.currentPage}`;
            fetchTrsanctions(link);

            setTransacLoading(false);
        }, 1000);

        return () => clearTimeout(delayDebounce);

    }, [id, transactionCount.currentPage]);

    useEffect(() => {

        setSubLoading(true);

        const delayDebounce = setTimeout(() => {
            let link = `${import.meta.env.VITE_BASE_URL}/admin/sub/donator/${id}?page=${subscriptionCount.currentPage}`;
            fetchSubscriptions(link);

            setSubLoading(false);
        }, 1000);

        return () => clearTimeout(delayDebounce);

    }, [id, subscriptionCount.currentPage]);


    return loading ? (
        <Loader />
    ) : (
        <DefaultLayout>
            <div className="flex flex-wrap items-center justify-evenly gap-8">
                <div className="flex flex-col md:flex-row justify-center gap-12">
                    <div className="flex flex-col gap-1">
                        <p className="text-2xl font-semibold text-white underline">Donator Details</p>
                        <p className="text-white"><span className="font-semibold">Id:</span> {donator?._id}</p>
                        <p className="text-white"><span className="font-semibold">Name</span> - {donator?.name}</p>
                        <p className="text-white"><span className="font-semibold">Email</span> - {donator?.email}</p>
                        <p className="text-white"><span className="font-semibold">Phone</span> - {donator?.phone}</p>
                        <p className="text-white"><span className="font-semibold">Active Donation</span> - {donator?.activeDonation?._id}</p>
                        <p className="text-white"><span className="font-semibold">Pan</span> - {donator?.pan}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-2xl font-semibold text-white underline">Address</p>
                        <p className="text-white"><span className="font-semibold">Street</span> - {donator?.address?.street}</p>
                        <p className="text-white"><span className="font-semibold">City</span> - {donator?.address?.city}</p>
                        <p className="text-white"><span className="font-semibold">State</span> - {donator?.address?.state}</p>
                        <p className="text-white"><span className="font-semibold">Country</span> - {donator?.address?.country}</p>
                        <p className="text-white"><span className="font-semibold">Postal Code</span> - {donator?.address?.postalCode}</p>
                    </div>
                </div>
            </div>

            {(subscriptions?.length! > 0) ? (
                <div className="flex flex-col gap-10 my-10">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex justify-between items-center py-6 px-4 md:px-6 xl:px-7.5">
                            <h4 className="text-xl font-semibold text-black dark:text-white">
                                Subscriptions
                            </h4>
                            <div className="flex justify-center items-center space-x-4">
                                <button
                                    onClick={() => setSubscriptionCount({ ...subscriptionCount, currentPage: subscriptionCount.currentPage - 1 })}
                                    disabled={subscriptionCount.currentPage === 1}
                                    className="bg-slate-600 text-white py-2 px-4 rounded-md"
                                >
                                    Prev
                                </button>
                                <p className="text-md font-semibold truncate">
                                    {subscriptionCount.currentPage} / {Math.ceil(subscriptionCount.filteredSubscriptions / subscriptionCount.resultPerPage)}
                                </p>
                                <button
                                    onClick={() => setSubscriptionCount({ ...subscriptionCount, currentPage: subscriptionCount.currentPage + 1 })}
                                    disabled={subscriptionCount.currentPage === Math.ceil(subscriptionCount.filteredSubscriptions / subscriptionCount.resultPerPage)}
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
                            <div className="col-span-2 flex items-center">
                                <p className="font-medium">Billing Cycle</p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="font-medium">Next Billing</p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="font-medium">Method</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="font-medium">Status</p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="font-medium">Type</p>
                            </div>
                        </div>

                        {subLoading ? (
                            <div className="flex justify-center items-center border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
                                <div className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}></div>
                            </div>
                        ) : (
                            <>
                                {subscriptions?.map((sub, key) => (
                                    <div
                                        className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                                        key={key}
                                        onClick={() => navigate(`/subscriptions/details?id=${sub._id}`)}
                                    >
                                        <div className="col-span-2 flex items-center">
                                            <p className="text-sm text-black dark:text-white">
                                                {String(new Date(sub.start).toLocaleDateString())} - {String(new Date(sub.end).toLocaleDateString())}
                                                {sub._id === donator?.activeDonation._id ? (<span className="hidden lg:inline-block bg-green-300 text-black rounded-full px-2 py-1 ml-3 font-semibold">Latest</span>) : null}
                                            </p>
                                        </div>
                                        <div className="col-span-2 flex items-center">
                                            <p className="text-sm text-black dark:text-white">
                                                {String(new Date(sub.currentStart).toLocaleDateString())} - {String(new Date(sub.currentEnd).toLocaleDateString())}
                                            </p>
                                        </div>
                                        <div className="col-span-1 hidden items-center sm:flex">
                                            <p className="text-sm text-black dark:text-white">
                                                {String(new Date(sub.nextBilling).toLocaleDateString())}
                                            </p>
                                        </div>
                                        <div className="col-span-1 hidden items-center sm:flex">
                                            <p className="text-sm text-black dark:text-white">
                                                {sub?.paymentMethod?.methodType?.toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="col-span-1 flex items-center">
                                            <p className="text-sm text-black dark:text-white">{sub.status.toUpperCase()}</p>
                                        </div>
                                        <div className="col-span-1 hidden items-center sm:flex">
                                            <p className="text-sm text-meta-3">
                                                {sub.subscriptionType.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-2xl font-semibold my-10 text-center">No Subscriptions yet!</p>
            )}

            {(transactions?.length! > 0) ? (
                <div className="flex flex-col gap-10 my-10">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex justify-between items-center py-6 px-4 md:px-6 xl:px-7.5">
                            <h4 className="text-xl font-semibold text-black dark:text-white">
                                Donations
                            </h4>
                            <div className="flex justify-center items-center space-x-4">
                                <button
                                    onClick={() => setTransactionCount({ ...transactionCount, currentPage: transactionCount.currentPage - 1 })}
                                    disabled={transactionCount.currentPage === 1}
                                    className="bg-slate-600 text-white py-2 px-4 rounded-md"
                                >
                                    Prev
                                </button>
                                <p className="text-md font-semibold truncate">
                                    {transactionCount.currentPage} / {Math.ceil(transactionCount.filteredTransactions / transactionCount.resultPerPage)}
                                </p>
                                <button
                                    onClick={() => setTransactionCount({ ...transactionCount, currentPage: transactionCount.currentPage + 1 })}
                                    disabled={transactionCount.currentPage === Math.ceil(transactionCount.filteredTransactions / transactionCount.resultPerPage)}
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

                        {transacLoading ? (
                            <div className="flex justify-center items-center border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
                                <div className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}></div>
                            </div>
                        ) : (
                            <>
                                {transactions?.map((transac, key) => (
                                    <div
                                        className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                                        key={key}
                                        onClick={() => navigate(`/transactions/details?id=${transac._id}`)}
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
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-2xl font-semibold my-10 text-center">No Transactions yet!</p>
            )}
        </DefaultLayout>
    )
}

export default DonatorDetails;