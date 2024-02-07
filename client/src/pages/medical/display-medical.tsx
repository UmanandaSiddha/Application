import Loader from "@/components/rest/loader";
import { getMedical } from "@/redux/api/medicalApi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { toast } from 'react-toastify';
import Same from "./same";

const DisplayMedical = () => {

    const [search] = useSearchParams();
    const id = search.get("medicalId");
    const [creatorData, setCreatorData] = useState<object | any>(null);

    const gotCreator = async () => {
        try {
            const data = await getMedical(id!)
            setCreatorData(data.medical);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        gotCreator();
    }, [])

    return (
        <div>
            {id ? (
                <div className='flex flex-col justify-center gap-4 items-center mt-8'>
                    {creatorData ? (
                        <div className="space-y-4">
                            <Same medical={creatorData} />
                        </div>
                    ) : (
                        <p>Medical Data Not Found</p>
                    )}
                </div>
            ) : (
                <Loader />
            )}
        </div>
    )
}

export default DisplayMedical;