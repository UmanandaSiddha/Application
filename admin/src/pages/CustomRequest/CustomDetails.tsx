import { useSearchParams } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout"
import { useEffect, useState } from "react";
import { CustomReuest } from "../../types/types";
import { CustomRequestResponse } from "../../types/api-types";
import axios from "axios";
import { toast } from "react-toastify";

const CustomDetails = () => {

    const [search] = useSearchParams();
    const id = search.get("id");
    const [requests, setRequests] = useState<CustomReuest>();

    const fetchRequests = async () => {
        try {
            const { data }: { data: CustomRequestResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/request/${id}`, { withCredentials: true });
            setRequests(data.request);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
       fetchRequests();
    }, [id])

    return (
        <DefaultLayout>
            <div className="flex flex-wrap items-center justify-evenly gap-3">
                <div className="flex flex-col gap-1">
                   <p>{requests?.email}</p>
                </div>
                <div className="flex flex-col gap-4">
                    <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                        Mark as Attended
                    </button>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default CustomDetails;