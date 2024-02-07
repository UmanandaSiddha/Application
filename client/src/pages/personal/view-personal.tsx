import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { viewPersonal } from "@/redux/api/personalApi";
import { personalExist, personalNotExist } from "@/redux/reducer/personalReducer";

import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import Loader from "@/components/rest/loader";
import Same from "./same";
import QrCode from "qrcode";

const ViewPersonal = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [qr, setQr] = useState("");

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const { personal, loading } = useSelector(
        (state: RootState) => state.personalReducer
    );

    const handlePersonal = async () => {
        try {
            const data = await viewPersonal();
            // console.log(data);
            dispatch(personalExist(data.personal));
            const link = `${window.location.protocol}//${window.location.hostname}:5173/display/personal?personalId=${data.personal._id.toString()}`;
            const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
            setQr(qre)
        } catch (error: any) {
            dispatch(personalNotExist());
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        handlePersonal();
    }, []);

    return (
        <div className="flex flex-col gap-4 justify-center items-center my-8">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <h1 className="text-3xl font-semibold">Personal VCard</h1>
                    {personal ? (
                        <div className="flex flex-col justify-center items-center">
                            <div className="flex gap-4">
                                <Button onClick={() => navigate("/dashboard/personal/input")} disabled={!isPaid}>Update Vcard</Button>
                                <Button disabled={!isPaid}><a href={qr} download={`${personal?._id}.png`}>Downlaod</a></Button>
                            </div>
                            {!isPaid && <p>You are not Subscribed</p>}
                            <div>
                                {isPaid ? (
                                    <img src={qr} alt={personal?._id} />
                                ) : (
                                    <p>Subscribe to view QR</p>
                                )}
                            </div>
                            {isPaid ? (
                                <div className="space-y-4">
                                    <Same personal={personal} />
                                </div>
                            ) : (
                                <div>
                                    Subscribe to view Personal Details
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <Button onClick={() => navigate("/dashboard/personal/input")} disabled={!isPaid}>Create Vcard</Button>
                            {/* {!isPaid && <p>You are not Subscribed</p>} */}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default ViewPersonal;