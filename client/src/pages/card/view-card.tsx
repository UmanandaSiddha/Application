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
// import { SinglePersonalResponse } from "@/types/api-types";
// import { Personal } from "@/types/card_types";
// import axios from "axios";
// import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";

// type CardCategory = "individual" | "botanical" | "animal" | "creator" | "medical";

const ViewCard = () => {
    // const [searchParams, setSearchParams] = useSearchParams();
    // const type = (searchParams.get("type") as CardCategory) || "individual";
    // const id = searchParams.get("id");
    const { type } = useParams();
    const isMobile = useMediaQuery({ maxWidth: 628 });
    const isDesktop = useMediaQuery({ maxWidth: 1024 });

    // const [card, setCard] = useState<Personal | null>(null);
    // const [loading, setLoading] = useState(false);

    // const fetchData = async (id: string, type: string) => {
    //     setLoading(true);
    //     try {
    //         const { data }: { data: SinglePersonalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/detailed/${id}?type=${type}`, { withCredentials: true });
    //         setCard(data.vCard);
    //     } catch (error: any) {
    //         toast.error(error.response.data.message);
    //     }
    //     setLoading(false);
    // };

    // useEffect(() => {
    //     if (type && ["botanical", "individual", "medical", "creator", "animal"].includes(type) && id) {
    //         fetchData(id, type);
    //     }
    // }, [type, id]);

    let backgroundImage;
    switch (type) {
        case "individual":
            backgroundImage = isMobile ? IndividualViewCardBackgroundMobile : IndividualViewCardBackgroundDesktop;
            break;
        case "botanical":
            backgroundImage = isMobile ? BotanicalViewCardBackgroundMobile : BotanicalViewCardBackgroundDesktop;
            break;
        case "animal":
            backgroundImage = isMobile ? AnimalViewCardBackgroundMobile : AnimalViewCardBackgroundDesktop;
            break;
        case "creator":
            backgroundImage = isMobile ? CreatorViewCardBackgroundMobile : CreatorViewCardBackgroundDesktop;
            break;
        case "medical":
            backgroundImage = MedicalViewCardBackgroundMobile;
            break;
        default:
            backgroundImage = isMobile ? IndividualViewCardBackgroundMobile : IndividualViewCardBackgroundDesktop;
    }

    const renderCard = () => {
        switch (type) {
            case "botanical":
                return <BotanicalViewCard />;
            case "individual":
                return <IndividualViewCard />;
            case "medical":
                return <MedicalViewCard />;
            case "creator":
                return <CreatorViewCard />;
            case "animal":
                return <AnimalViewCard />;
            default:
                return <h1>You have enter a broken link, no cards here</h1>;
        }
    };

    return (
        <div className="">
            {!isDesktop && type === "medical" ? (
                <MedicalDesktopViewCard />
            ) : (
                <>
                    <div
                        className={`flex flex-col justify-center items-center w-full h-[30vh] bg-cover bg-bottom`}
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    >
                        <div className="h-16 w-16 bg-white rounded-full"></div>
                        <div className="mt-2">
                            <h2>David Strom</h2>
                            <p>Data Analyst</p>
                        </div>
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
            )}
        </div>
    )
}

export default ViewCard;