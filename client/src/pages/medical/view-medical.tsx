import { useEffect, useState } from "react";
import Loader from "@/components/rest/loader";
import { useNavigate } from "react-router-dom";
import { viewMedical } from "@/redux/api/medicalApi";
import { medicalExist, medicalNotExist } from "@/redux/reducer/medicalReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import Same from "./same";
import QrCode from "qrcode";

const ViewMedical = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [qr, setQr] = useState("");

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const { medical, loadings } = useSelector(
        (state: RootState) => state.medicalReducer
    );

    const handleMedical = async () => {
        try {
            const data = await viewMedical();
            dispatch(medicalExist(data.medical));
            const link = `${window.location.protocol}//${window.location.hostname}/display/medical?medicalId=${data.medical._id.toString()}`;
            const qre = await QrCode.toDataURL(link, {width: 200, margin: 2});
            setQr(qre)
        } catch (error: any) {
            dispatch(medicalNotExist());
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        handleMedical();
    }, []);

    return (
        <div className="flex flex-col gap-4 justify-center items-center mt-8">
            {loadings ? (
                <Loader />
            ) : (
                <>
                    <h1 className="text-3xl font-semibold">Medical VCard</h1>
                    {medical ? (
                        <div className="flex flex-col gap-2 justify-center items-center">
                            <div className="flex gap-4">
                                <Button onClick={() => navigate("/dashboard/medical/input")} disabled={!isPaid}>Update Vcard</Button>
                                <Button disabled={!isPaid}><a href={qr} download={`${medical?._id}.png`}>Downlaod</a></Button>
                            </div>
                            {!isPaid && <p>You are not Subscribed</p>}
                            <div>
                                {isPaid ? (
                                    <img src={qr} alt={medical._id} />
                                ) : (
                                    <p>Subscribe to view QR</p>
                                )}
                            </div>
                            {isPaid ? (
                                <div className="space-y-4">
                                    <Same medical={medical} />
                                </div>
                            ) : (
                                <div>
                                    Subscribe to view Medical Details
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <Button onClick={() => navigate("/dashboard/medical/input")} disabled={!isPaid}>Create Vcard</Button>
                            {!isPaid && <p>You are not Subscribed</p>}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default ViewMedical;