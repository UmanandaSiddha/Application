import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { useEffect, useState } from 'react';
import { Subscription } from '../../types/types';
import { AllSubscriptionResponse } from '../../types/api-types';
import axios from 'axios';
import { toast } from 'react-toastify';

const Subscriptions = () => {

    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>();
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredSubscriptions: 1,
        totalSubscriptions: 1
    });

    const fetchSubscriptions = async (url: string) => {
        try {
            const { data }: { data: AllSubscriptionResponse } = await axios.get(url, { withCredentials: true });
            setSubscriptions(data.subscriptions);
            setCounts({
                ...counts,
                resultPerPage: data.resultPerPage,
                filteredSubscriptions: data.filteredSubscriptionsCount,
                totalSubscriptions: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        let link = `${import.meta.env.VITE_BASE_URL}/admin/sub/all?page=${counts.currentPage}`;
        fetchSubscriptions(link);
    }, [counts.currentPage]);

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Subscriptions
                        </h4>
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage - 1 })}
                                disabled={counts.currentPage === 1}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Prev
                            </button>
                            <p className="text-md font-semibold truncate">{counts.currentPage} / {Math.ceil(counts.filteredSubscriptions / counts.resultPerPage)}</p>
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
                                disabled={counts.currentPage === Math.ceil(counts.filteredSubscriptions / counts.resultPerPage)}
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

                    {subscriptions?.map((sub, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/subscription-details?id=${sub._id}`)}
                        >
                            <div className="col-span-2 flex items-center">
                                <p className="text-sm text-black dark:text-white">{String(new Date(sub.start).toLocaleDateString())} - {String(new Date(sub.end).toLocaleDateString())}</p>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <p className="text-sm text-black dark:text-white">{String(new Date(sub.currentStart).toLocaleDateString())} - {String(new Date(sub.currentEnd).toLocaleDateString())}</p>
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
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Subscriptions;