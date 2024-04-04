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
import Tree from "@/components/view-card/tree";
import { useSearchParams } from "react-router-dom";
import Creator from "@/components/view-card/creator";
import Animal from "@/components/view-card/animal";
import Medical from "@/components/view-card/medical";
import Personal from "@/components/view-card/personal";

const DisplayCard = () => {

    const [search] = useSearchParams();
    const id = search.get("id");
    const type = search.get("type");

    const [card, setCard] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (["tree", "personal", "medical", "creator", "animal"].includes(type!) && id) {
                try {
                    const { data }: { data: SingleTreeResponse | SinglePersonalResponse | SingleMedicalResponse | SingleCreatorResponse | SingleAnimalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/details/${id!}?type=${type}`, { withCredentials: true });
                    setCard(data.vCard);
                } catch (error: any) {
                    toast.error(error.response.data.message);
                }
            }
            setLoading(false);
        }

        fetchData();
    }, [type]);

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

    const headSetter = (headType: String) => {
        if (["tree", "personal", "medical", "creator", "animal"].includes(type!)) {
            return headType.charAt(0).toUpperCase() + headType.slice(1).toLowerCase();
        } else {
            return;
        }
    }

    return (
        <div className='flex flex-col justify-center border border-primary p-6 gap-4 items-center mx-4 my-8'>
            <h1 className="text-3xl font-semibold">{headSetter(type!)} Details</h1>
            {loading ? <Loader /> : <>{renderCard()}</>}
        </div>
    )
}

export default DisplayCard;