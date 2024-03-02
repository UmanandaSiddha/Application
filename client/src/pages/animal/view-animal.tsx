import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import QrCode from "qrcode";

import { toast } from "react-toastify";
import { SingleAnimalResponse } from "@/types/api-types";
import axios from "axios";
import { animalTemp } from "@/redux/reducer/animalReducer";

const ViewAnimal = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [search] = useSearchParams();
    const id = search.get("animalId");

    const [singleTree, setSingleTree] = useState<any | null>(null);
    const [qr, setQr] = useState("");

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const gotAnimal = async () => {
        try {
            const { data }: { data: SingleAnimalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/animal/detailed/${id!}`, { withCredentials: true });
            setSingleTree(data.animal);
            dispatch(animalTemp(data.animal));
            if (isPaid) {
                const link = `${window.location.protocol}//${window.location.hostname}/display/animal?animalId=${id!}`
                const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
                setQr(qre)
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        gotAnimal();
    }, []);

    const delAnimal = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/animal/delete/${id!}`, { withCredentials: true });
            toast.success("Animal Deleted");
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='flex flex-col justify-center border border-primary p-6 gap-4 items-center mx-4 my-8'>
                    <h1 className="text-3xl font-semibold font-Kanit">Animal Details</h1>
                    <div>
                        {isPaid ? (
                            <img src={qr} alt={singleTree?._id} />
                        ) : (
                            <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
                        )}
                    </div>
                    <div>
                        <div className="flex">
                            <div className="basis-1/2">
                                <p className="font-Kanit font-semibold">Animal Id:</p>
                            </div>
                            <div className="basis-1/2">
                                <p className="font-Kanit">
                                    {singleTree?._id}
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="basis-1/2">
                                <p className="font-Kanit font-semibold">Species:</p>
                            </div>
                            <div className="basis-1/2">
                                <p className="font-Kanit">
                                    {singleTree?.species}
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="basis-1/2">
                                <p className="font-Kanit font-semibold">Name:</p>
                            </div>
                            <div className="basis-1/2">
                                <p className="font-Kanit">
                                    {singleTree?.name}
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="basis-1/2">
                                <p className="font-Kanit font-semibold">Age:</p>
                            </div>
                            <div className="basis-1/2">
                                <p className="font-Kanit">
                                    {singleTree?.age}
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="basis-1/2">
                                <p className="font-Kanit font-semibold">Gender:</p>
                            </div>
                            <div className="basis-1/2">
                                <p className="font-Kanit">
                                    {singleTree?.gender}
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="basis-1/2">
                                <p className="font-Kanit font-semibold">Color/Markings:</p>
                            </div>
                            <div className="basis-1/2">
                                <p className="font-Kanit">
                                    {singleTree?.color}
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="basis-1/2">
                                <p className="font-Kanit font-semibold">Location:</p>
                            </div>
                            <div className="basis-1/2">
                                <p className="font-Kanit">
                                    {singleTree?.location}
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="basis-1/2">
                                <p className="font-Kanit font-semibold">Owner:</p>
                            </div>
                            <div className="basis-1/2">
                                <p className="font-Kanit">
                                    {singleTree?.owner}
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="basis-1/2">
                                <p className="font-Kanit font-semibold">Phone Number:</p>
                            </div>
                            <div className="basis-1/2">
                                <p className="font-Kanit">
                                    {singleTree?.phone}
                                </p>
                            </div>
                        </div>
                        
                    </div>
                    <div className="flex gap-6">
                        <Button disabled={!isPaid}><a href={qr} download={`${singleTree?._id}.png`}>Download</a></Button>
                        <Button variant="outline" disabled={!isPaid} onClick={() => navigate(`/dashboard/animal/create?animalId=${singleTree?._id}`)}>Edit</Button>
                        <Button onClick={() => delAnimal()} disabled={!isPaid} variant="destructive">Delete</Button>
                    </div>
                </div>
    )
}

export default ViewAnimal;