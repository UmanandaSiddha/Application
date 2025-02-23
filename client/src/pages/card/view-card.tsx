import AnimalViewCard from "@/components/cards/animal-view-card";
import CreatorViewCard from "@/components/cards/creator-view-card";
import MedicalDesktopViewCard from "@/components/cards/medical-desktop-view-card";
import MedicalViewCard from "@/components/cards/medical-view-card";
import BotanicalViewCard from "@/components/cards/botanical-view-card";
import IndividualViewCard from "@/components/cards/individual-view-card";
import {
    AnimalViewCardBackgroundDesktop,
    AnimalViewCardBackgroundMobile,
    BotanicalViewCardBackgroundDesktop,
    BotanicalViewCardBackgroundMobile,
    CreatorViewCardBackgroundDesktop,
    CreatorViewCardBackgroundMobile,
    IndividualViewCardBackgroundDesktop,
    IndividualViewCardBackgroundMobile,
    MedicalViewCardBackgroundMobile
} from "@/constants/cards/view-card";
import { useMediaQuery } from "react-responsive";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimalData, BotanyData, CreatorData, ICard, IndividualData, MedicalData } from "@/types/type";
import { useEffect, useState } from "react";
import API from "@/config/apiConfig";
import { toast } from "react-toastify";
import Loader from "@/components/rest/loader";
import { AnimalCardIcon, BotanicalCardIcon, CreatorCardIcon, IndividualCardIcon, MedicalCardIcon } from "@/constants/cards/icons";

interface SingleCardResponse {
    success: boolean;
    card: ICard;
}

const ViewCard = () => {
    const { shortId, type, id } = useParams();
    const isMobile = useMediaQuery({ maxWidth: 628 });
    const isDesktop = useMediaQuery({ maxWidth: 1024 });

    const location = useLocation();
    const navigate = useNavigate();

    const displayPage = location.pathname.startsWith("/d/");
    const viewPage = location.pathname.startsWith("/dashboard/cards/card/");

    const [card, setCard] = useState<ICard | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchViewData = async (id: string, type: string) => {
        setLoading(true);
        try {
            const { data }: { data: SingleCardResponse } = await API.get(`/cards/detailed/${id}?type=${type}`);
            setCard(data.card);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setLoading(false);
    };

    const fetchDisplayData = async (shortId: string) => {
        setLoading(true);
        try {
            const { data }: { data: SingleCardResponse } = await API.get(`/cards/details/${shortId}`);
            setCard(data.card);
            navigate(`/d/${data.card.shortCode}/${data.card.type}`, { replace: true });
        } catch (error: any) {
            console.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (viewPage && type && ["BOTANICAL", "INDIVIDUAL", "MEDICAL", "CREATOR", "ANIMAL"].includes(type) && id) {
            fetchViewData(id, type);
        } else if (displayPage && shortId) {
            fetchDisplayData(shortId);
        } else {
            toast.error("Invalid card link, please check your URL");
        }
    }, [type, id, shortId]);

    let backgroundImage;
    let cardIcon;
    switch (type?.toLowerCase()) {
        case "individual":
            backgroundImage = isMobile ? IndividualViewCardBackgroundMobile : IndividualViewCardBackgroundDesktop;
            cardIcon = IndividualCardIcon;
            break;
        case "botanical":
            backgroundImage = isMobile ? BotanicalViewCardBackgroundMobile : BotanicalViewCardBackgroundDesktop;
            cardIcon = BotanicalCardIcon;
            break;
        case "animal":
            backgroundImage = isMobile ? AnimalViewCardBackgroundMobile : AnimalViewCardBackgroundDesktop;
            cardIcon = AnimalCardIcon;
            break;
        case "creator":
            backgroundImage = isMobile ? CreatorViewCardBackgroundMobile : CreatorViewCardBackgroundDesktop;
            cardIcon = CreatorCardIcon;
            break;
        case "medical":
            backgroundImage = MedicalViewCardBackgroundMobile;
            cardIcon = MedicalCardIcon;
            break;
        default:
            backgroundImage = isMobile ? IndividualViewCardBackgroundMobile : IndividualViewCardBackgroundDesktop;
            cardIcon = IndividualCardIcon;
    }

    const renderCard = () => {
        switch (type?.toLowerCase()) {
            case "botanical":
                return card && <BotanicalViewCard cardData={card.data as BotanyData} />;
            case "individual":
                return card && <IndividualViewCard cardData={card.data as IndividualData} />;
            case "medical":
                return card && <MedicalViewCard cardData={card.data as MedicalData} />;
            case "creator":
                return card && <CreatorViewCard cardData={card.data as CreatorData} />;
            case "animal":
                return card &&  <AnimalViewCard cardData={card.data as AnimalData} />;
            default:
                return <h1>You have enter a broken link, no cards here</h1>;
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="">
            {!isDesktop && type === "MEDICAL" ? (
                <MedicalDesktopViewCard />
            ) : card ? (
                <>
                    <div
                        className={`flex flex-col justify-center items-center gap-2 w-full h-[30vh] bg-cover bg-bottom`}
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    >
                        <div className="h-14 w-14 bg-white rounded-full">
                            <img src={cardIcon} className="h-full w-full rounded-full" alt="card-icon" />
                        </div>
                        <h2 className="text-white text-lg font-semibold">{card?.data.name}</h2>
                    </div>
                    <div className="px-2 mb-12">
                        <div className="mt-4 w-full md:w-[90%] mx-auto flex flex-col justify-center items-center bg-[#F7F7F7] border-2 border-gray-200 rounded-xl">
                            <div className="w-full">
                                {renderCard()}
                            </div>
                            <div className="mt-12 flex flex-col justify-center items-center pb-12">
                                <p className="pb-3 text-xl font-semibold text-[#292929]">Made with</p>
                                <img src="/voolata_long_r.png" alt="" className="w-36" />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center">
                    <h1 className="text-red-500 text-xl font-semibold">You have enter a broken link, no cards here</h1>
                </div>
            )}
        </div>
    )
}

export default ViewCard;