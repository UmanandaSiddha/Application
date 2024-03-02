import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import Same from "./same";
import QrCode from "qrcode";
import { SingleMedicalResponse } from "@/types/api-types";
import axios from "axios";
import { medicalTemp } from "@/redux/reducer/medicalReducer";

const ViewMedical = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [search] = useSearchParams();
    const id = search.get("medicalId");
    
    const [qr, setQr] = useState("");
    const [singleTree, setSingleTree] = useState<any | null>(null);

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const handleMedical = async () => {
        try {
            const { data }: { data: SingleMedicalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/medical/detailed/${id!}`, { withCredentials: true });
            setSingleTree(data.medical);
            dispatch(medicalTemp(data.medical));
            const link = `${window.location.protocol}//${window.location.hostname}/display/medical?medicalId=${id!}`;
            const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
            setQr(qre)
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        handleMedical();
    }, []);

    const delMedical = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/medical/delete/${id!}`, {withCredentials: true})
            toast.success("Medical Deleted");
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }


    return (
        <div className='flex flex-col justify-center border border-primary p-6 gap-4 items-center mx-4 my-8'>
            <h1 className="text-3xl font-semibold font-Kanit">Medical Details</h1>
            <div>
                {isPaid ? (
                    <img src={qr} alt={singleTree?._id} />
                ) : (
                    <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
                )}
            </div>
            <div className="space-y-4">
                <Same medical={singleTree} />
            </div>
            <div className="flex gap-6">
                <Button disabled={!isPaid}><a href={qr} download={`${singleTree?._id}.png`}>Downlaod</a></Button>
                <Button variant="outline" disabled={!isPaid} onClick={() => navigate(`/dashboard/medical/input?medicalId=${singleTree?._id}`)}>Edit</Button>
                <Button onClick={() => delMedical()} disabled={!isPaid} variant="destructive">Delete</Button>
            </div>
        </div>
    )
}

export default ViewMedical;