import Loader from "@/components/rest/loader";
import { SingleAnimalResponse } from "@/types/api-types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { toast } from 'react-toastify';

const DisplayAnimal = () => {

    const [search] = useSearchParams();
    const id = search.get("animalId");
    const [singleTree, setSingleTree] = useState<any | null>(null);

    const gotAnimal = async () => {
        try {
            const { data }: { data: SingleAnimalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/animal/details/${id}`, { withCredentials: true });
            setSingleTree(data.animal);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        gotAnimal();
    }, [])

    return (
        <>
            {id ? (
                <div className='flex flex-col justify-center gap-4 items-center mt-8'>
                    {singleTree ? (
                        <div>
                            <p><span className="font-semibold">AnimalId:</span> {singleTree?._id}</p>
                            <p><span className="font-semibold">Species:</span> {singleTree?.species}</p>
                            <p><span className="font-semibold">Name:</span> {singleTree?.name}</p>
                            <p><span className="font-semibold">Age:</span> {singleTree?.age}</p>
                            <p><span className="font-semibold">Gender:</span> {singleTree?.gender}</p>
                            <p><span className="font-semibold">Color / Markings:</span> {singleTree?.color}</p>
                            <p><span className="font-semibold">Location:</span> {singleTree?.location}</p>
                            <p><span className="font-semibold">Owner / Caretaker:</span> {singleTree?.owner}</p>
                            <p><span className="font-semibold">Phone Number:</span> {singleTree?.phone}</p>
                        </div>
                    ) : (
                        <p>Animal data not found</p>
                    )}

                </div>
            ) : (
                <Loader />
            )}
        </>
    )
}

export default DisplayAnimal;