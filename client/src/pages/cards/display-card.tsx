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
import { useSearchParams } from "react-router-dom";
import TreeComponent from "@/components/view-card/tree";
import CreatorComponent from "@/components/view-card/creator";
import AnimalComponent from "@/components/view-card/animal";
import MedicalComponent from "@/components/view-card/medical";
import PersonalComponent from "@/components/view-card/personal";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/types";

const DisplayCard = () => {

    const [search] = useSearchParams();
    const id = search.get("id");
    const type = search.get("type");

    const [card, setCard] = useState<Tree | Personal | MedicalType | Creator | Animal | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (["tree", "personal", "medical", "creator", "animal"].includes(type!) && id) {
                try {
                    const { data }: { data: SingleTreeResponse | SinglePersonalResponse | SingleMedicalResponse | SingleCreatorResponse | SingleAnimalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/details/${id!}?type=${type}`, { withCredentials: true });
                    setCard(data.vCard);
                    localStorage.setItem("display_card", JSON.stringify(data.vCard));
                } catch (error: any) {
                    toast.error(error.response.data.message);
                }
            }
            setLoading(false);
        }

        const cardData = localStorage.getItem("display_card");
        if (cardData) {
            setCard(JSON.parse(cardData));
            if (card?._id !== id) {
                fetchData();
            }
        } else {
            fetchData();
        }
    }, [type]);

    const renderCard = () => {
        switch (type) {
            case "tree":
                return <TreeComponent card={card as Tree} />;
            case "personal":
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
        <div className=" border border-primary p-6 gap-4 items-center mx-4 my-8 md:mx-8 lg:mx-16 xl:mx-32">
            {loading ? <Loader /> : renderCard()}
        </div>
    )
}

export default DisplayCard;