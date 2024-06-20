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

    const fetchRequests = async () => {
        try {
            const { data }: { data: AllCustomReuestResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/requests/all`, { withCredentials: true });
            setRequests(data.requests);
            const localRequests = {
                created: Date.now() + 30 * 1000,
                data: data.requests,
            }
            window.localStorage.setItem("all_requests", JSON.stringify(localRequests));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const requestData = window.localStorage.getItem("all_requests");
        if (requestData) {
            if (JSON.parse(requestData)?.created < Date.now()) {
                window.localStorage.removeItem("all_requests");
                fetchRequests();
            } else {
                setRequests(JSON.parse(requestData).data);
            }
        } else {
            fetchRequests();
        }
    }, []);

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Cards
                        </h4>
                    </div>

                    <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                        <div className="col-span-2 flex items-center">
                            <p className="font-medium">Cards</p>
                        </div>
                        <div className="col-span-2 hidden items-center sm:flex">
                            <p className="font-medium">Amount</p>
                        </div>
                        <div className="col-span-2 hidden items-center sm:flex">
                            <p className="font-medium">Period</p>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <p className="font-medium">Interval</p>
                        </div>
                    </div>

                    {requests?.map((request, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/request-details?id=${request._id}`)}
                        >
                            <div className="col-span-2 flex items-center">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <p className="text-sm text-black dark:text-white">
                                        {request.cards}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-2 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {request.amount}
                                </p>
                            </div>
                            <div className="col-span-2 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {request.period}
                                </p>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <p
                                    className="text-sm text-meta-3 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/card-details?id=${request.user._id}`);
                                    }}
                                >
                                    {request.interval}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Custom;