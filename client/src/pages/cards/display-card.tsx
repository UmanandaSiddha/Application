import {
    SingleAnimalResponse,
    SingleCreatorResponse,
    SingleMedicalResponse,
    SinglePersonalResponse,
    SingleTreeResponse
} from "@/types/api-types";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "@/components/rest/loader";
import { useParams, useSearchParams } from "react-router-dom";
import TreeComponent from "@/components/view-card/tree";
import CreatorComponent from "@/components/view-card/creator";
import AnimalComponent from "@/components/view-card/animal";
import MedicalComponent from "@/components/view-card/medical";
import PersonalComponent from "@/components/view-card/personal";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/card_types";

type CardInfoResponseType = {
    success: boolean;
    cardId: string;
    cardType: string;
}

const DisplayCard = () => {

    const [search, setSearch] = useSearchParams();
    const id = search.get("id");
    const type = search.get("type");
    const { shortId } = useParams();

    const [card, setCard] = useState<Tree | Personal | MedicalType | Creator | Animal | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async (id : string, type: string) => {
        setLoading(true);
        try {
            const { data }: { data: SingleTreeResponse | SinglePersonalResponse | SingleMedicalResponse | SingleCreatorResponse | SingleAnimalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/details/${id}?type=${type}`, { withCredentials: true });
            setCard(data.vCard);
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchShortId = async (shortId: string) => {
        setLoading(true);
        try {
            const { data }: { data: CardInfoResponseType } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/short/${shortId}`, { withCredentials: true });
            setSearch({ type: data.cardType, id: data.cardId }, { replace: true });
            fetchData(data.cardId, data.cardType);
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (type && ["botanical", "individual", "medical", "creator", "animal"].includes(type) && id) {
            fetchData(id, type);
        } else if (shortId) {
            fetchShortId(shortId);
        } else {
            toast.error("Invalid card link, please check your URL");
        }
    }, [id, type, shortId]);

    const renderCard = () => {
        switch (type) {
            case "botanical":
                return <TreeComponent card={card as Tree} />;
            case "individual":
                return <PersonalComponent card={card as Personal} />;
            case "medical":
                return <MedicalComponent card={card as MedicalType} />;
            case "creator":
                return <CreatorComponent card={card as Creator} />;
            case "animal":
                return <AnimalComponent card={card as Animal} />;
            default:
                return <h1 className="text-center">You have entered a broken link, no cards here</h1>;
        }
    }

    return (
        <div className="m-auto  p-auto lg:w-2/3">
            <div className="border border-primary p-6 gap-4 items-center mx-4 my-8 md:mx-8 lg:mx-16 xl:mx-32">
                {loading ? <Loader /> : renderCard()}
            </div>
        </div>
    )
}

export default DisplayCard;