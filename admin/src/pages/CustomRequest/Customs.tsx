import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { AllCustomReuestResponse } from "../../types/api-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CustomReuest } from "../../types/types";

const Custom = () => {

    const navigate = useNavigate();
    const [requests, setRequests] = useState<CustomReuest[]>();
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredRequests: 1,
        totalRequests: 1
    });


    const fetchRequests = async (url: string) => {
        try {
            const { data }: { data: AllCustomReuestResponse } = await axios.get(url, { withCredentials: true });
            setRequests(data.requests);
            setCounts({
                ...counts,
                resultPerPage: data.resultPerPage,
                filteredRequests: data.filteredRequestsCount,
                totalRequests: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const link = `${import.meta.env.VITE_BASE_URL}/admin/request/all?page=${counts.currentPage}`;
        fetchRequests(link);
    }, [counts.currentPage]);

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Requests
                        </h4>

                        <div className="flex justify-center items-center space-x-4">
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage - 1 })}
                                disabled={counts.currentPage === 1}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Prev
                            </button>
                            <p className="text-md font-semibold truncate">{counts.currentPage} / {Math.ceil(counts.filteredRequests / counts.resultPerPage)}</p>
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
                                disabled={counts.currentPage === Math.ceil(counts.filteredRequests / counts.resultPerPage)}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                        <div className="col-span-1 hidden items-center sm:flex">
                            <p className="font-medium">Cards</p>
                        </div>
                        <div className="col-span-2 hidden items-center sm:flex">
                            <p className="font-medium">Email</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Amount</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Attended</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Status</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Period</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Interval</p>
                        </div>
                    </div>

                    {requests?.map((request, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/request-details?id=${request._id}`)}
                        >
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {request.cards}
                                </p>
                            </div>
                            <div className="col-span-2 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {request.email}
                                </p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{request.amount}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{String(request.attended).toUpperCase()}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{String(request.status).toUpperCase()}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{request.period.toUpperCase()}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{request.interval}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Custom;