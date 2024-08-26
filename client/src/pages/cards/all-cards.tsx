import axios from "axios";
import {
    AnimalResponse,
    CreatorResponse,
    MedicalResponse,
    PersonalResponse,
    TreeResponse,
} from "@/types/api-types";
import { BsQrCodeScan } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { IoShareOutline } from "react-icons/io5";
import { IoDownloadOutline } from "react-icons/io5";
import { HiMiniArrowSmallRight } from "react-icons/hi2";
import { HiMiniArrowSmallLeft } from "react-icons/hi2";

// import Loader from "@/components/rest/loader";
// import { User } from "../../types/types";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
import QRCodeStyling from "qr-code-styling";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Animal,
    Creator,
    MedicalType,
    Personal,
    Tree,
} from "@/types/card_types";
import SideBar from "@/components/rest/sidebar";
import { FaPlus } from "react-icons/fa";
import { Loader2 } from "lucide-react";

type CardType =
    | TreeResponse
    | PersonalResponse
    | MedicalResponse
    | CreatorResponse
    | AnimalResponse;

const qrStyles: Record<string, { qrColor: string; dotColor: string }> = {
    botanical: { qrColor: "#4ade80", dotColor: "#22c55e" },
    individual: { qrColor: "#60a5fa", dotColor: "#3b82f6" },
    medical: { qrColor: "#818cf8", dotColor: "#6366f1" },
    creator: { qrColor: "#22d3ee", dotColor: "#06b6d4" },
    animal: { qrColor: "#f87171", dotColor: "#ef4444" },
    default: { qrColor: "#9ca3af", dotColor: "#6b7280" },
};

const createQRCode = (type: string, cardId: string) => {
    const styles = type && qrStyles[type] ? qrStyles[type] : qrStyles.default;

    return new QRCodeStyling({
        width: 300,
        height: 300,
        margin: 0,
        data: `http://localhost:5173/display?id=${cardId}&type=${type}`,
        qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "H",
        },
        image: `http://localhost:5173/${type}.svg`,
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 0,
        },
        dotsOptions: {
            type: "extra-rounded",
            color: styles.qrColor,
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        cornersSquareOptions: {
            type: "extra-rounded",
            color: styles.dotColor,
        },
        cornersDotOptions: {
            color: styles.qrColor,
        },
    });
};

const GenerateQRCode = ({ type, card, way }: {
    type: string;
    card: Tree | Personal | MedicalType | Creator | Animal;
    way?: string;
}) => {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

    useEffect(() => {
        const qrCode = createQRCode(type, card._id);

        qrCode.getRawData("png").then((data) => {
            if (data) {
                const dataUrl = URL.createObjectURL(new Blob([data], { type: "image/png" }));
                setQrCodeDataUrl(dataUrl);
            }
        });
    }, [type, card]);

    if (way && way === "qr-group") {
        return (
            <div className="h-full w-full">
                <div className="bg-white p-2 rounded-xl">
                    {qrCodeDataUrl ? (
                        <img src={qrCodeDataUrl} alt={card._id} className="rounded-lg object-cover" />
                    ) : (
                        <Loader2 />
                    )}
                </div>
                <div className="flex items-center justify-center mt-3 text-2xl text-black font-semibold">
                    {card.name}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center p-4 rounded-xl bg-white shadow-lg border gap-2">
            {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt={card.name} className="h-40 w-40 rounded-lg" />
            ) : (
                <Loader2 />
            )}
            <p>{card.name}</p>
        </div>
    );
};

const AllCards = () => {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const type = search.get("type");
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    
    // const { isPaid, user } = useSelector((state: RootState) => state.userReducer);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [countData, setCountData] = useState(1);
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState<Tree[] | Personal[] | MedicalType[] | Creator[] | Animal[] | null>();

    const fetchData = async () => {
        setLoading(true);
        if (["botanical", "individual", "medical", "creator", "animal"].includes(type!)) {
            try {
                const { data }: { data: CardType } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/user?page=${currentPage}&type=${type}`, { withCredentials: true });
                setCards(data.vCards);
                setCountData(data.count);
                localStorage.setItem("all_card", JSON.stringify(data.vCards));
                localStorage.setItem("current_page", JSON.stringify(currentPage));
                localStorage.setItem("card_type", JSON.stringify(type));
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        const cardData = localStorage.getItem("all_card");
        const cardType = localStorage.getItem("card_type");
        const currentCardPage = localStorage.getItem("current_page");
        if ( cardData && cardType === type && Number(currentCardPage ? JSON.parse(currentCardPage) : 1) === currentPage) {
            setCards(JSON.parse(cardData));
            setCountData(JSON.parse(cardData).length);
        } else {
            fetchData();
        }
    }, [currentPage, type]);


    function prevQR(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        e.preventDefault();
        if (cards) {
            if (currentIndex === 0) {
                setCurrentPage(prev => prev === 0 ? 0 : prev + 1);
            }
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? cards?.length - 1 : prevIndex - 1
            );
        }
    }

    function nextQR(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        e.preventDefault();
        if (cards) {
            if (currentIndex === countData - 1) {
                setCurrentPage(prev => prev + 1);
            }
            setCurrentIndex((nextIndex) =>
                nextIndex === cards.length - 1 ? 0 : nextIndex + 1
            );
        }
    }

    const typeStyles: Record<string, { backgroundColor: string, textColor: string, mdBackgroundColor: string, iconColor: string }> = {
        botanical: { backgroundColor: "bg-green-200", textColor: "bg-green-500", mdBackgroundColor: "md:bg-green-500", iconColor: "text-green-500" },
        individual: { backgroundColor: "bg-blue-200", textColor: "bg-blue-500", mdBackgroundColor: "md:bg-blue-500", iconColor: "text-blue-500" },
        animal: { backgroundColor: "bg-red-200", textColor: "bg-red-500", mdBackgroundColor: "md:bg-red-500", iconColor: "text-red-500" },
        creator: { backgroundColor: "bg-cyan-200", textColor: "bg-cyan-500", mdBackgroundColor: "md:bg-cyan-500", iconColor: "text-cyan-500" },
        medical: { backgroundColor: "bg-indigo-200", textColor: "bg-indigo-500", mdBackgroundColor: "md:bg-indigo-500", iconColor: "text-indigo-500" },
        default: { backgroundColor: "bg-gray-200", textColor: "bg-gray-500", mdBackgroundColor: "md:bg-gray-500", iconColor: "text-gray-500" }
    };

    const styles = type && typeStyles[type] ? typeStyles[type] : typeStyles.default;

    const handleDownload = () => {
        if (cards?.[currentIndex]._id && type) {
            const qrCode = createQRCode(type, cards?.[currentIndex]._id);

            qrCode.getRawData("png").then((data) => {
                if (data) {
                    const element = document.createElement("a");
                    element.href = URL.createObjectURL(new Blob([data], { type: "image/png" }));
                    element.download = `${cards?.[currentIndex]._id}.png`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                }
            });
        }
    }

    const handleShare = () => {
        if (cards?.[currentIndex]._id && type) {
            window.navigator.clipboard.writeText(`http://localhost:5173/display?id=${cards?.[currentIndex]._id}&type=${type}`);
            toast.success("Link has been copied to clipboard");
        } else {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="flex justify-center bg-white">
            <div className="flex flex-row w-full md:w-[90%] lg:w-[80%] md:space-x-4 lg:space-x-4">
                <div className="basis-1/4 hidden lg:block">
                    <SideBar />
                </div>
                <div className="basis-full md:basis-2/3 lg:basis-2/4 flex justify-center items-center lg:max-h-screen md:my-2 bg-slate-100 rounded-md">
                    <div className="relative w-full h-screen md:max-h-[87vh] overflow-hidden">
                        <div className={`absolute w-full h-full ${styles.backgroundColor} mobile-curve rounded-lg`}></div>
                        <div className="absolute w-full h-full flex flex-col justify-evenly space-y-2 items-center z-10 md:overflow-y-auto hide-scrollbar md:p-4">

                            <div className='flex flex-col items-center justify-center pt-4 space-y-3'>
                                <div className={`flex justify-center items-center ${styles.textColor} rounded-2xl py-4 px-4 shadow-xl text-white font-semibold`}>
                                    <BsQrCodeScan className='mx-2 w-[1rem] h-[1rem]' />
                                    <p className='text-lg font-bold'>
                                        {type && type.charAt(0).toUpperCase() + type.slice(1)} Data
                                    </p>
                                </div>
                                <div className='flex flex-col justify-center items-center'>
                                    <p className='text-md font-normal text-slate-800'>Share this QR Code to share your</p>
                                    <h1 className='text-xl font-semibold text-slate-900'>
                                        {type && type.charAt(0).toUpperCase() + type.slice(1)} Data
                                    </h1>
                                </div>
                            </div>

                            {loading ? (
                                <div>
                                    <Loader2 />
                                </div>
                            ) : (
                                <div>
                                    {cards && cards?.length > 0 ? (
                                        <div className="flex flex-row justify-evenly items-center pt-4 space-x-6 px-4">
                                            <button
                                                className={`p-1 rounded-full ${styles.textColor} text-white flex justify-center items-center hover:cursor-pointer`}
                                                onClick={prevQR}
                                            >
                                                <IoIosArrowBack className="w-[2rem] h-[2rem]" />
                                            </button>
                                            <div className="overflow-hidden flex justify-center items-center w-full">
                                                {cards?.map((card, index) => (
                                                    <div
                                                        key={card._id}
                                                        className={`flex h-66 w-56 flex-col transition-transform duration-300 ease-in-out ${index === currentIndex ? 'block' : 'hidden'}`}
                                                        onClick={() => navigate(`/dashboard/cards/card?id=${card._id}&type=${type}`)}
                                                    >
                                                        <GenerateQRCode way="qr-group" card={card} type={type || "botanical"} />
                                                    </div>
                                                )
                                                )}
                                            </div>
                                            <button
                                                className={`p-1 rounded-full ${styles.textColor} text-white flex justify-center items-center hover:cursor-pointer`}
                                                onClick={nextQR}
                                            >
                                                <MdOutlineNavigateNext className="w-[2rem] h-[2rem]" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            No Card Yet
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className='flex flex-col md:pt-6 pt-12 space-y-6 md:w-2/3 w-3/4'>
                                {cards && cards?.length > 0 && (
                                    <div className='flex flow-row justify-evenly space-x-4 w-full'>
                                        <button onClick={handleShare} className={`flex md:flex-row flex-col justify-center items-center space-x-2 md:space-y-0 space-y-4 ${styles.mdBackgroundColor} shadow-lg bg-white text-slate-500 px-5 py-4 md:rounded-md rounded-3xl text-lg font-semibold md:text-white w-1/2`}>
                                            <IoShareOutline className={`md:text-white ${styles.iconColor} text-lg`} />
                                            <p>Share</p>
                                        </button>
                                        <button onClick={handleDownload} className={`flex md:flex-row flex-col justify-center items-center space-x-2 md:space-y-0 space-y-4 ${styles.mdBackgroundColor} shadow-lg bg-white text-slate-500 px-5 py-4 md:rounded-md rounded-3xl text-lg font-semibold md:text-white w-1/2`}>
                                            <IoDownloadOutline className={`md:text-white ${styles.iconColor} text-lg`} />
                                            <p>Download</p>
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={() => {
                                        navigate(`/dashboard/${type}/create`);
                                    }}
                                    className={`flex justify-center items-center space-x-2 ${styles.textColor} px-4 py-3 rounded-md text-lg font-semibold text-white w-full`}
                                >
                                    <FaPlus />
                                    <p>Add New Card</p>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="basis-1/3 lg:basis-1/4 hidden md:block">
                    <div className='flex flex-col justify-center items-center mt-6'>
                        <div className='flex justify-center items-center gap-6'>
                            <button onClick={() => setCurrentPage(currentPage => currentPage-1)} className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8">
                                <HiMiniArrowSmallLeft size={25} />
                            </button>
                            <p className="text-lg font-semibold">{currentPage} / {Math.ceil(countData / 5)}</p>
                            <button onClick={() => setCurrentPage(currentPage => currentPage+1)} className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8">
                                <HiMiniArrowSmallRight size={25} />
                            </button>
                        </div>
                        {cards && cards?.length > 0 ? (
                            <div className='max-h-[75vh] m-2 hide-scrollbar overflow-y-scroll'>
                                <div className='flex flex-col justify-center items-center space-y-4 p-4'>
                                    {cards?.map((card, index) => (
                                        <GenerateQRCode key={index} card={card} type={type || "botanical"} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                no cards here
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllCards;