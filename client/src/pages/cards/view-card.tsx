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
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/rest/loader";
import TreeComponent from "@/components/view-card/tree";
import AnimalComponent from "@/components/view-card/animal";
import CreatorComponent from "@/components/view-card/creator";
import MedicalComponent from "@/components/view-card/medical";
import PersonalComponent from "@/components/view-card/personal";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/types";

const ViewCard = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("id");
    const type = search.get("type");

    const [card, setCard] = useState<Tree | Personal | MedicalType | Creator | Animal | null>(null);
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
                    localStorage.setItem("current_card", JSON.stringify(data.vCard));
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

        const cardData = localStorage.getItem("current_card");
        if (cardData) {
            setCard(JSON.parse(cardData));
            if (card?._id !== id) {
                fetchData();
            }
        } else {
            fetchData();
        }
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
                    <TreeComponent card={card as Tree} />
                );
            case "personal":
                return (
                    <PersonalComponent card={card as Personal} />
                )
            case "medical":
                return (
                    <MedicalComponent card={card as MedicalType} />
                )
            case "creator":
                return (
                    <CreatorComponent card={card as Creator} />
                )
            case "animal":
                return (
                    <AnimalComponent card={card as Animal} />
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
        <>
        <div className='w-full'>
            {/* <div>
                {(isPaid || user?.role === "admin") ? (
                    <img src={qr} alt={card?._id} />
                ) : (
                    <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
                )}
            </div> */}
            <div>
                {loading ? <Loader /> : <>{renderCard()}</>}
            </div>
            {/* <div className="flex gap-6">
                <Button disabled={!isPaid && user?.role !== "admin"}><a href={qr} download={`${card?._id}.png`}>Download</a></Button>
                <Button variant="outline" disabled={!isPaid && user?.role !== "admin"} onClick={() => navigate(setLink(type!, card?._id!))}>Edit</Button>
                <Button onClick={() => deleteCard()} disabled={!isPaid && user?.role !== "admin"} variant="destructive">Delete</Button>
            </div> */}
            <div className="w-full py-2 flex justify-center pt-10 bg-yellow-200">
                <button className="py-2 bg-green-700 text-white font-Kanit w-[90%] rounded-md hover:cursor-pointer shadow-md" disabled={!isPaid && user?.role !== "admin"}>
                    <a href={qr} download={`${card?._id}.png`}>
                        Download
                    </a>
                </button>
            </div>
            <div className="w-full py-2 flex justify-center bg-yellow-200">
                <button className="py-2 bg-black text-white font-Kanit w-[90%] rounded-md hover:cursor-pointer shadow-md" disabled={!isPaid && user?.role !== "admin"} onClick={() => navigate(setLink(type!, card?._id!))}>
                        Edit
                </button>
            </div>
            <div className="w-full py-2 flex pb-4 justify-center bg-yellow-200">
                <button className="py-2 bg-red-600 text-white font-Kanit w-[90%] rounded-md hover:cursor-pointer shadow-md" disabled={!isPaid && user?.role !== "admin"} onClick={() => deleteCard()}>
                        Delete
                </button>
            </div>
        </div>
        </>
    )
}

export default ViewCard;