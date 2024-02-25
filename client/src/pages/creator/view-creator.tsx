import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from 'react-toastify';
import QrCode from "qrcode";
import { SingleCreatorResponse } from "@/types/api-types";
import axios from "axios";

const ViewCreator = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("creatorId");

    const [qr, setQr] = useState("");
    const [singleTree, setSingleTree] = useState<any | null>(null);

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const handleCreator = async () => {
        try {
            const { data }: { data: SingleCreatorResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/creator/detailed/${id!}`, { withCredentials: true });
            setSingleTree(data.creator);
            console.log(data.creator)
            const link = `${window.location.protocol}//${window.location.hostname}/display/creator?creatorId=${id!}`;
            const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
            setQr(qre)
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        handleCreator();
    }, []);

    const delCreator = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/creator/delete/${id!}`)
            toast.success("Creator Deleted");
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='flex flex-col justify-center border border-primary p-6 gap-4 items-center mx-4 my-8'>
            <h1 className="text-3xl font-semibold">Creator Details</h1>
            <div>
                {isPaid ? (
                    <img src={qr} alt={singleTree?._id} />
                ) : (
                    <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
                )}
            </div>
            <div className="space-y-4">
                <p><span className="font-semibold">CreatorId:</span> {singleTree?._id}</p>
                <p><span className="font-semibold">Name:</span> {singleTree?.name}</p>
                <div>
                    <h1 className="text-2xl font-semibold">Social Links</h1>
                    {(singleTree?.links)?.map((link: any, index: number) => (
                        <p key={index}><span className="font-semibold">{link.label}:</span> {link.name}</p>
                    ))}
                </div>
            </div>
            <div className="flex gap-6">
                <Button disabled={!isPaid}><a href={qr} download={`${singleTree?._id}.png`}>Downlaod</a></Button>
                <Button variant="outline" disabled={!isPaid} onClick={() => navigate(`/dashboard/creator/input?creatorId=${singleTree?._id}`)}>Edit</Button>
                <Button onClick={() => delCreator()} disabled={!isPaid} variant="destructive">Delete</Button>
            </div>
        </div>
    )
}

export default ViewCreator