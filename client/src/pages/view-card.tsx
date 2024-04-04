import { 
    SingleAnimalResponse, 
    SingleCreatorResponse, 
    SingleMedicalResponse, 
    SinglePersonalResponse, 
    SingleTreeResponse 
} from "@/types/api-types";
import axios from "axios";
import QrCode from "qrcode";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Tree from "@/components/view-card/tree";
import Loader from "@/components/rest/loader";
import Animal from "@/components/view-card/animal";
import Creator from "@/components/view-card/creator";
import Medical from "@/components/view-card/medical";
import Personal from "@/components/view-card/personal";
import { useSearchParams, useNavigate } from "react-router-dom";

const ViewCard = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("id");
    const type = search.get("type");

    const [card, setCard] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [qr, setQr] = useState("");

    const { isPaid, user } = useSelector(
        (state: RootState) => state.userReducer
    );

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (["tree", "personal", "medical", "creator", "animal"].includes(type!) && id) {
                try {
                    const { data }: { data: SingleTreeResponse | SinglePersonalResponse | SingleMedicalResponse | SingleCreatorResponse | SingleAnimalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/detailed/${id!}?type=${type}`, { withCredentials: true });
                    setCard(data.vCard);
                    if (isPaid || user?.role === "admin") {
                        const link = `${window.location.protocol}//${window.location.host}/display?id=${id}&type=${type}`;
                        const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
                        setQr(qre);
                    }
                } catch (error: any) {
                    toast.error(error.response.data.message);
                }
            }
            setLoading(false);
        }

        fetchData();
    }, [type]);

    const headSetter = (headType: String) => {
        if (["tree", "personal", "medical", "creator", "animal"].includes(type!)) {
            return headType.charAt(0).toUpperCase() + headType.slice(1).toLowerCase();
        } else {
            return;
        }
    }

    const deleteCard = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=tree`, { withCredentials: true });
            toast.success("Card Deleted");
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const renderCard = () => {
        switch (type) {
            case "tree":
                return (
                    <Tree card={card} />
                );
            case "personal":
                return (
                    <Personal card={card} />
                )
            case "medical":
                return (
                    <Medical card={card} />
                )
            case "creator":
                return (
                    <Creator card={card} />
                )
            case "animal":
                return (
                    <Animal card={card} />
                )
            default:
                return (
                    <h1>You have enter a broken link, no cards here</h1>
                );
        }
    }

    const setLink = (type: String, id: String) => {
        switch (type) {
            case "tree":
                return `/dashboard/tree/create?treeId=${id}`
            case "personal":
                return `/dashboard/personal/create?personalId=${id}`;
            case "medical":
                return `/dashboard/medical/create?medicalId=${id}`;
            case "creator":
                return `/dashboard/creator/create?creatorId=${id}`;
            case "animal":
                return `/dashboard/animal/create?animalId=${id}`;
            default:
                return `/dashboard/tree/create?treeId=${id}`;
        }
    }

    return (
        <div className='flex flex-col justify-center border border-primary p-6 gap-4 items-center mx-4 my-8'>
            <h1 className="text-3xl font-semibold">{headSetter(type!)} Details</h1>
            <div>
                {(isPaid || user?.role === "admin") ? (
                    <img src={qr} alt={card?._id} />
                ) : (
                    <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
                )}
            </div>
            <div>
                {loading ? <Loader /> : <>{renderCard()}</>}
            </div>
            <div className="flex gap-6">
                <Button disabled={!isPaid && user?.role !== "admin"}><a href={qr} download={`${card?._id}.png`}>Download</a></Button>
                <Button variant="outline" disabled={!isPaid && user?.role !== "admin"} onClick={() => navigate(setLink(type!, card?._id))}>Edit</Button>
                <Button onClick={() => deleteCard()} disabled={!isPaid && user?.role !== "admin"} variant="destructive">Delete</Button>
            </div>
        </div>
    )
}

export default ViewCard;