import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import QrCode from "qrcode";

import { toast } from "react-toastify";
import { SinglePersonalResponse } from "@/types/api-types";
import axios from "axios";
import Same from "./same";

const ViewPersonal = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("personalId");
    
    const [qr, setQr] = useState("");
    const [singleTree, setSingleTree] = useState<any | null>(null);

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const handlePersonal = async () => {
        try {
            const { data }: { data: SinglePersonalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/personal/detailed/${id!}`, { withCredentials: true });
            setSingleTree(data.personal);
            const link = `${window.location.protocol}//${window.location.hostname}/display/personal?personalId=${id!}`;
            const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
            setQr(qre)
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        handlePersonal();
    }, []);

    const delPersonal = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/personal/delete/${id!}`)
            toast.success("Personal Deleted");
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='flex flex-col justify-center border border-primary p-6 gap-4 items-center mx-4 my-8'>
            <h1 className="text-3xl font-semibold">Personal Details</h1>
            <div>
                {isPaid ? (
                    <img src={qr} alt={singleTree?._id} />
                ) : (
                    <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
                )}
            </div>
            <div className="space-y-4">
                <Same personal={singleTree} />
            </div>
            <div className="flex gap-6">
                <Button disabled={!isPaid}><a href={qr} download={`${singleTree?._id}.png`}>Downlaod</a></Button>
                <Button variant="outline" disabled={!isPaid} onClick={() => navigate(`/dashboard/personal/input?personalId=${singleTree?._id}`)}>Edit</Button>
                <Button onClick={() => delPersonal()} disabled={!isPaid} variant="destructive">Delete</Button>
            </div>
        </div>
    )
}

export default ViewPersonal;