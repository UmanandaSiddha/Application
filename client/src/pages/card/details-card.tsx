import CardActionsButton from "@/components/cards/card-actions-button";
import CardHeaderSwitchButton from "@/components/cards/card-header-switch-button";
import CardQR from "@/components/cards/card-qr";
import QRCode from "@/components/cards/qr-code";
import { DownloadButtonIcon, NoQR, ShareButtonIcon } from "@/constants/cards/actions";
import {
    AnimalBackgroundPng,
    BotanyBackgroundPng,
    CreatorBackgroundPng,
    IndividualBackgroundPng,
    MedicalBackgroundPng
} from "@/constants/cards/background";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useSearchParams } from "react-router-dom";
// import html2canvas from "html2canvas";
import axios from "axios";
import { toast } from "react-toastify";
import useCardTraversal from "@/hooks/useCardTraversal";
import { Loader2 } from "lucide-react";
// import DotIndicator from "@/components/cards/dot-indicator";
import { ICard } from "@/types/type";
import { ActiveTabs, CardCategory, FetchUserCardsResponse } from "./dashboard";
import { qrStyles } from "@/lib/helper";

const DetailsCard = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const type = (searchParams.get("type") as CardCategory) || "ALL";
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState<ICard[] | null>(null);
    const [counts, setCounts] = useState({
        currentPage: Number(searchParams.get("currentPage")) || 1,
        resultPerPage: 20,
        filteredCards: 1,
        totalCards: 1
    });
    const [activeTab, setActiveTab] = useState<ActiveTabs>(searchParams.get("activeTab") as ActiveTabs || "qr");
    const cardRef = useRef<HTMLDivElement>(null);
    const isSmaller = useMediaQuery({ maxWidth: 380 });
    const isMobile = useMediaQuery({ maxWidth: 628 });

    const { currentIndex, setCurrentIndex, handleNext, handlePrev, hasNext, hasPrev, handleDownload, handleShare, downloadDivAsImage } = useCardTraversal(cards, counts, setCounts);

    const fetchData = async (link: string) => {
        try {
            const { data }: { data: FetchUserCardsResponse } = await axios.get(link, { withCredentials: true });
            setCards(data.cards);
            setCounts(prev => ({
                ...prev,
                resultPerPage: data.resultPerPage,
                filteredCards: data.filteredCardsCount,
                totalCards: data.count
            }));
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error fetching data");
            setCards([]);
        }
    };

    useEffect(() => {
        const queryParams = [
            `page=${counts.currentPage}`,
            `type=${type}`,
        ].filter(Boolean).join("&");

        setLoading(true);

        setCards([]);

        if (type && ["ALL", "BOTANICAL", "INDIVIDUAL", "MEDICAL", "CREATOR", "ANIMAL"].includes(type)) {
            const link = `${import.meta.env.VITE_BASE_URL}/cards/user?${queryParams}`;
            fetchData(link);
        }

        setLoading(false);

    }, [type, counts.currentPage]);

    useEffect(() => {
        setCurrentIndex(Number(searchParams.get("currentIndex")) || 0);
    }, []);

    useEffect(() => {
        setSearchParams(prev => {
            prev.set("currentPage", counts.currentPage.toString());
            prev.set("currentIndex", currentIndex.toString());
            prev.set("type", type);
            prev.set("activeTab", activeTab);
            return prev;
        }, { replace: true });
    }, [counts.currentPage, currentIndex, type, activeTab]);

    useEffect(() => {
        if (!isMobile) {
            navigate("/dashboard", { replace: true });
        }
    }, [isMobile, useMediaQuery]);

    let backgroundImage = IndividualBackgroundPng;
    switch (type.toLowerCase()) {
        case "individual":
            backgroundImage = IndividualBackgroundPng;
            break;
        case "botanical":
            backgroundImage = BotanyBackgroundPng;
            break;
        case "animal":
            backgroundImage = AnimalBackgroundPng;
            break;
        case "creator":
            backgroundImage = CreatorBackgroundPng;
            break;
        case "medical":
            backgroundImage = MedicalBackgroundPng;
            break;
        default:
            backgroundImage = IndividualBackgroundPng;
    }

    const styles = type && qrStyles[type.toLowerCase()] ? qrStyles[type.toLowerCase()] : qrStyles.default;

    return (
        <div className="mt-14 bg-slate-50 hide-scrollbar">
            <div
                className={`w-full ${isSmaller ? "h-[85vh]" : "h-[65vh]"} bg-cover bg-bottom`}
                style={{ backgroundImage: `url(${backgroundImage || `../../assets/cards/background/individual_mobile.svg`})` }}
            >
                <div className="flex items-center justify-center space-x-12 pt-3 w-full px-4">
                    <CardHeaderSwitchButton
                        isActive={activeTab === "qr"}
                        setIsActive={() => setActiveTab("qr")}
                        placeholder={type.charAt(0).toUpperCase() + type.slice(1)}
                        type={type}
                    />
                    <CardHeaderSwitchButton
                        isActive={activeTab === "card"}
                        setIsActive={() => setActiveTab("card")}
                        placeholder={"Card"}
                        type={type}
                    />
                </div>

                <div className='flex flex-col justify-center items-center pt-6'>
                    <p className='text-sm font-normal text-slate-800'>
                        Share this QR Code to share your
                    </p>
                    <h1 className='text-md font-semibold text-slate-900'>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Data
                    </h1>
                </div>

                <div className="flex flex-row justify-evenly items-center w-full pt-12 space-x-6 px-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handlePrev()
                        }}
                        disabled={!hasPrev()}
                        className={`p-1 ${!hasPrev() ? "hover:cursor-not-allowed" : "hover:cursor-pointer"} rounded-full bg-[rgb(0,0,0,0.24)] text-white flex justify-center items-center`}
                    >
                        <IoIosArrowBack size={38} />
                    </button>
                    <div className="h-64 w-64">
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <Loader2 className="text-center animate-spin" />
                            </div>
                        ) : cards && cards.length > 0 ? cards?.map((card, index) => (
                            <div key={index} onClick={(e) => e.stopPropagation()} className="overflow-hidden flex justify-center items-center space-y-4">
                                <div
                                    className={`transition-transform duration-300 ease-in-out text-white ${index === currentIndex ? 'block' : 'hidden'}`}
                                >
                                    {activeTab === "qr" ? (
                                        <>
                                            <QRCode shortCode={card.shortCode} type={card.type} />
                                            <p className="mt-4 text-center text-xl font-semibold">{card.data.name}</p>
                                        </>
                                    ) : (

                                        <CardQR shortCode={card.shortCode} name={card.data.name} type={card.type} ref={cardRef} />
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="mt-12 flex flex-col justify-center items-center space-y-4">
                                <img src={NoQR} alt="no qr" className="h-24 w-24" />
                                <p className="text-[#7D7D7D] font-semibold text-lg">No existing QR codes</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleNext()
                        }}
                        disabled={!hasNext()}
                        className={`p-1 ${!hasNext() ? "hover:cursor-not-allowed" : "hover:cursor-pointer"} rounded-full bg-[rgb(0,0,0,0.24)] text-white flex justify-center items-center`}
                    >
                        <MdOutlineNavigateNext size={38} />
                    </button>
                </div>
            </div>
            <div className='flex flex-col md:pt-4 pt-8 space-y-6 px-6 pb-12'>
                {/* <div className="flex items-center justify-center gap-3">
                    <DotIndicator totalCards={counts.totalCards} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
                </div> */}
                <div className='flex flow-row justify-evenly space-x-4 w-full'>
                    <CardActionsButton
                        imageSrc={ShareButtonIcon}
                        onClick={handleShare}
                        placeholder="Share"
                    />
                    <CardActionsButton
                        imageSrc={DownloadButtonIcon}
                        // onClick={handleDownload}
                        onClick={activeTab === "card" ? downloadDivAsImage : handleDownload}
                        placeholder="Download"
                    />
                </div>
                <button
                    className={`flex justify-center items-center space-x-2 ${styles.bgColor} px-4 py-3 text-white rounded-md w-full`}
                    onClick={() => navigate(`/dashboard/${type}/create`)}
                >
                    <FaPlus />
                    <p className="text-lg font-semibold">Add New Card</p>
                </button>
            </div>
        </div>
    )
}

export default DetailsCard