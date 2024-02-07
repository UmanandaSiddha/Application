import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Loader from "@/components/rest/loader";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from 'react-toastify';
import { viewCreator } from "@/redux/api/creatorApi";
import { creatorExist, creatorNotExist } from "@/redux/reducer/creatorreducer";
import QrCode from "qrcode";

const ViewCreator = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [qr, setQr] = useState("");

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const { creator, loading } = useSelector(
        (state: RootState) => state.creatorReducer
    );

    const handleCreator = async () => {
        try {
            const data = await viewCreator();
            dispatch(creatorExist(data.creator));
            const link = `${window.location.protocol}//${window.location.hostname}/display/creator?creatorId=${data.creator?._id.toString()}`;
            const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
            setQr(qre)
        } catch (error: any) {
            dispatch(creatorNotExist());
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        handleCreator();
    }, []);

    return (
        <div className="flex flex-col gap-4 justify-center items-center mt-8">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <h1 className="text-3xl font-semibold">Creator VCard</h1>
                    {creator ? (
                        <div className="flex flex-col gap-2 justify-center items-center">
                            <div className="flex gap-4">
                                <Button onClick={() => navigate("/dashboard/creator/update")} disabled={!isPaid}>Update Vcard</Button>
                                <Button disabled={!isPaid}><a href={qr} download={`${creator?._id}.png`}>Downlaod</a></Button>
                            </div>
                            {!isPaid && <p>You are not Subscribed</p>}
                            <div>
                                {isPaid ? (
                                    <img src={qr} alt={creator?._id} />
                                ) : (
                                    <p>Subscribe to view QR</p>
                                )}
                            </div>
                            {isPaid ? (
                                <div className="space-y-4">
                                    <p><span className="font-semibold">CreatorId:</span> {creator._id}</p>
                                    <p><span className="font-semibold">Name:</span> {creator.name}</p>
                                    <div>
                                        <h1 className="text-2xl font-semibold">Social Links</h1>
                                        {creator.links.map((link: any, index: number) => (
                                            <p key={index}><span className="font-semibold">{link.label}:</span> {link.name}</p>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    Subscribe to view Creator Details
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <Button onClick={() => navigate("/dashboard/creator/input")} disabled={!isPaid}>Create Vcard</Button>
                            {!isPaid && <p>You are not Subscribed</p>}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default ViewCreator