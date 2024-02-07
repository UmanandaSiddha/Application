import Loader from "@/components/rest/loader";
import { getCreator } from "@/redux/api/creatorApi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { toast } from 'react-toastify';

const DisplayCreator = () => {

    const [search] = useSearchParams();
    const id = search.get("creatorId");
    const [creatorData, setCreatorData] = useState<object | any>(null);

    const gotCreator = async () => {
        try {
            const data = await getCreator(id!)
            setCreatorData(data.creator);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        gotCreator();
    }, [])

    return (
        <>
            {id ? (
                <div className='flex flex-col justify-center gap-4 items-center mt-8'>
                    {creatorData ? (
                        <div className="space-y-4">
                            <p><span className="font-semibold">CreatorId:</span> {creatorData?._id}</p>
                            <p><span className="font-semibold">Name:</span> {creatorData?.name}</p>
                            <div>
                                <h1 className="text-2xl font-semibold">Social Links</h1>
                                {creatorData?.links.map((link: any, index: number) => (
                                    <p key={index}><span className="font-semibold">{link.label}:</span> {link.name}</p>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>Creator Data Not Found</p>
                    )}
                </div>
            ) : (
                <Loader />
            )}
        </>
    )
}

export default DisplayCreator