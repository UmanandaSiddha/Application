import Loader from "@/components/rest/loader";
import { getPersonal } from "@/redux/api/personalApi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { toast } from 'react-toastify';
import Same from "./same";

const DisplayPersonal = () => {

    const [search] = useSearchParams();
    const id = search.get("personalId");
    const [creatorData, setCreatorData] = useState<object | any>(null);

    const gotCreator = async () => {
        try {
            const data = await getPersonal(id!)
            setCreatorData(data.personal);
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
                    <div className="space-y-4">
                        <Same personal={creatorData} />
                    </div>
                </div>
            ) : (
                <Loader />
            )}
        </div>
    )
}

export default DisplayPersonal;