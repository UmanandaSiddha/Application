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
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { createQRCode, typeStyles } from "@/lib/helper";
import { GenerateQRCode } from "@/components/rest/generate-qr";

export type CardType =
    | TreeResponse
    | PersonalResponse
    | MedicalResponse
    | CreatorResponse
    | AnimalResponse;

const AllCards = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [countData, setCountData] = useState(1);
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState<Tree[] | Personal[] | MedicalType[] | Creator[] | Animal[] | null>();

    const fetchData = async (page: number) => {
        setLoading(true);
        try {
            const { data }: { data: CardType } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/user?page=${page}&type=${type}`, { withCredentials: true });
            setCards(data.vCards);
            setCountData(data.count);
            setCurrentPage(page);
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (type && ["botanical", "individual", "medical", "creator", "animal"].includes(type)) {
            fetchData(currentPage);
        }
    }, [currentPage, type]);

    const handleNext = () => {
        if (cards) {
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else if (currentPage * 5 < countData) {
                setCurrentPage(currentPage + 1)
                setCurrentIndex(0);
            }
        }
    };

    const handlePrev = () => {
        if (cards) {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            } else if (currentPage > 1) {
                setCurrentPage(currentPage - 1)
                setCurrentIndex(4);
            }
        }
    };

    const styles = type && typeStyles[type] ? typeStyles[type] : typeStyles.default;

    const handleDownload = () => {
        if (cards && cards?.[currentIndex].shortCode && type) {
            const qrCode = createQRCode(type, cards?.[currentIndex].shortCode);

            qrCode.download({
                name: cards?.[currentIndex]._id,
                extension: "png"
            });
        }
    }

    const handleShare = () => {
        if (cards && cards?.[currentIndex].shortCode && type) {
            window.navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/d/${cards?.[currentIndex].shortCode}`);
            toast.success("Link has been copied to clipboard");
        } else {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="flex justify-center bg-white ">
            <div className="flex flex-row w-full md:w-[90%] lg:w-[80%] md:space-x-4 lg:space-x-4">
                <div className="basis-1/4 hidden lg:block">
                    <SideBar />
                </div>
                <div className="basis-full  md:basis-2/3 lg:basis-2/4 flex justify-center items-center lg:max-h-screen md:my-2 bg-slate-100 rounded-md">
                    <div className="relative w-full h-screen md:max-h-[87vh] overflow-hidden">
                        <div className={`absolute w-full h-full ${styles.backgroundColor} mobile-curve rounded-lg`}></div>
                        <div className="absolute w-full h-full flex flex-col justify-evenly space-y-2 items-center z-10 md:overflow-y-auto hide-scrollbar md:p-4">

                            <button onClick={() => navigate(`/dashboard/${type}/create`)} className='flex flex-col items-center justify-center pt-4 space-y-3'>
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
                            </button>

                            {loading ? (
                                <div>
                                    <Loader2 className="text-center animate-spin" />
                                </div>
                            ) : (
                                <div>
                                    {cards && cards?.length > 0 ? (
                                        <div className="flex flex-row justify-evenly items-center pt-4 space-x-6 px-4">
                                            <button
                                                className={`p-1 rounded-full ${styles.textColor} text-white flex justify-center items-center hover:cursor-pointer`}
                                                onClick={handlePrev}
                                                disabled={currentPage === 1 && currentIndex === 0}
                                            >
                                                <IoIosArrowBack className="w-[2rem] h-[2rem]" />
                                            </button>
                                            <div className="overflow-hidden flex justify-center items-center w-full">
                                                {cards?.map((card, index) => (
                                                    <div
                                                        key={card._id}
                                                        className={`flex h-66 w-48 md:w-56 flex-col transition-transform duration-300 ease-in-out ${index === currentIndex ? 'block' : 'hidden'}`}
                                                        onClick={() => navigate(`/dashboard/cards/card/${type}/${card._id}`)}
                                                    >
                                                        <GenerateQRCode way="qr-group" card={card} type={type || "botanical"} />
                                                    </div>
                                                )
                                                )}
                                            </div>
                                            <button
                                                className={`p-1 rounded-full ${styles.textColor} text-white flex justify-center items-center hover:cursor-pointer`}
                                                onClick={handleNext}
                                                disabled={currentPage * 5 >= countData && currentIndex === cards.length - 1}
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
                                            <IoShareOutline size={25} className={`md:text-white ${styles.iconColor} text-lg`} />
                                            <p>Share</p>
                                        </button>
                                        <button onClick={handleDownload} className={`flex md:flex-row flex-col justify-center items-center space-x-2 md:space-y-0 space-y-4 ${styles.mdBackgroundColor} shadow-lg bg-white text-slate-500 px-5 py-4 md:rounded-md rounded-3xl text-lg font-semibold md:text-white w-1/2`}>
                                            <IoDownloadOutline size={25} className={`md:text-white ${styles.iconColor} text-lg`} />
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
                            <button onClick={() => setCurrentPage(currentPage => currentPage - 1)} className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8">
                                <HiMiniArrowSmallLeft size={25} />
                            </button>
                            <p className="text-lg font-semibold">{currentPage} / {Math.ceil(countData / 5)}</p>
                            <button onClick={() => setCurrentPage(currentPage => currentPage + 1)} className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8">
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