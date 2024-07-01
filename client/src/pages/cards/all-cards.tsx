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

import QrCode from "qrcode";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
// import Loader from "@/components/rest/loader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User } from "../../types/types";
import {
    Animal,
    Creator,
    MedicalType,
    Personal,
    Tree,
} from "@/types/card_types";
import SideBar from "@/components/rest/sidebar";
import { FaPlus } from "react-icons/fa";

type CardType =
    | TreeResponse
    | PersonalResponse
    | MedicalResponse
    | CreatorResponse
    | AnimalResponse;

const AllCards = () => {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const type = search.get("type");
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // const { isPaid, user } = useSelector((state: RootState) => state.userReducer);

    const [currentPage, setCurrentPage] = useState(1);
    const [countData, setCountData] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showOther, setShowOther] = useState<boolean>(false);
    const [cards, setCards] = useState<
        Tree[] | Personal[] | MedicalType[] | Creator[] | Animal[] | null
    >();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (
                ["botanical", "individual", "medical", "creator", "animal"].includes(
                    type!
                )
            ) {
                try {
                    const { data }: { data: CardType } = await axios.get(
                        `${import.meta.env.VITE_BASE_URL
                        }/cards/user?page=${currentPage}&type=${type}`,
                        { withCredentials: true }
                    );
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

        const cardData = localStorage.getItem("all_card");
        const cardType = localStorage.getItem("card_type");
        const currentCardPage = localStorage.getItem("current_page");
        if (
            cardData &&
            cardType === type &&
            Number(currentCardPage ? JSON.parse(currentCardPage) : 1) === currentPage
        ) {
            setCards(JSON.parse(cardData));
        } else {
            fetchData();
        }
    }, [currentPage, type]);

    // const setCurrentPageNo = (pageNumber: number) => {
    //   setCurrentPage(pageNumber);
    // };

    function prevQR() {
        if (cards) {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? cards?.length - 1 : prevIndex - 1
            );
        }
    }

    function nextQR() {
        if (cards) {
            setCurrentIndex((nextIndex) =>
                nextIndex === cards.length - 1 ? 0 : nextIndex + 1
            );
        }
    }

    function getColorClasses(type: string): string {
        switch (type) {
            case "botanical":
                return "green";
            case "medical":
                return "blue";
            case "creator":
                return "red";
            case "animal":
                return "red";
            case "individual":
                return "blue";
            default:
                return "green";
        }
    }

    const color = getColorClasses(type!);

    const [qr, setQr] = useState("");

    const generateCode = async () => {
        try {
            const link = `${window.location.protocol}//${window.location.host}/display?id=somelongandsatisfyingid&type=sometype`;
            const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
            setQr(qre);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        generateCode();
    }, []);

    return (
        <div className="flex justify-center">
            <div className="flex flex-row w-full md:w-[90%] lg:w-[80%] md:space-x-4 lg:space-x-4">
                <div className="basis-1/4 hidden lg:block">
                    <SideBar />
                </div>
                <div className="basis-full md:basis-2/3 lg:basis-2/4 flex justify-center items-center lg:max-h-screen md:my-2 bg-slate-100">
                    <div className="relative w-full h-screen overflow-hidden">
                        <div className="absolute w-full h-full bg-blue-200 mobile-curve rounded-lg"></div>
                        <div className="absolute w-full h-full flex flex-col justify-evenly space-y-4 items-center z-10">

                            <div className='flex flex-col items-center justify-center pt-4 space-y-7'>
                                <div className='flex justify-center items-center bg-blue-500 rounded-2xl py-4 px-4 shadow-xl text-white font-semibold'>
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

                            <div className="flex flex-row justify-evenly items-center pt-4 space-x-6 px-4">
                                <div
                                    className="p-1 rounded-full bg-slate-400 text-white flex justify-center items-center hover:cursor-pointer"
                                    onClick={prevQR}
                                >
                                    <IoIosArrowBack className="w-[2rem] h-[2rem]" />
                                </div>
                                <div className="overflow-hidden flex justify-center items-center w-full">
                                    {cards && cards.map((card, index) => (
                                        <div
                                            key={card._id}
                                            className={`flex flex-col transition-transform duration-300 ease-in-out ${index === currentIndex ? 'block' : 'hidden'}`}
                                            onClick={() => navigate(`/dashboard/cards/card?id=${card._id}&type=${type}`)}
                                        >
                                            <img src={qr} alt={card._id} className="rounded-lg w-56 h-56 object-cover" />
                                            <div className="flex items-center justify-center mt-3 text-2xl font-semibold">
                                                {card.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    className="p-1 rounded-full bg-slate-400 text-white flex justify-center items-center hover:cursor-pointer"
                                    onClick={nextQR}
                                >
                                    <MdOutlineNavigateNext className="w-[2rem] h-[2rem]" />
                                </div>
                            </div>

                            <div className='flex flex-col md:pt-6 pt-16 space-y-4 md:w-2/3 w-3/4'>
                                <div className='flex flow-row justify-evenly space-x-4 w-full'>
                                    <button className='flex md:flex-row flex-col justify-center items-center space-x-2 md:space-y-0 space-y-4 md:bg-blue-500 shadow-lg bg-white text-slate-500 px-5 py-4 md:rounded-md rounded-3xl text-lg font-semibold md:text-white w-1/2'>
                                        <IoShareOutline className='md:text-white text-blue-500 text-lg' />
                                        <p>Share</p>
                                    </button>
                                    <button className='flex md:flex-row flex-col justify-center items-center space-x-2 md:space-y-0 space-y-4 md:bg-blue-500 shadow-lg bg-white text-slate-500 px-5 py-4 md:rounded-md rounded-3xl text-lg font-semibold md:text-white w-1/2'>
                                        <IoDownloadOutline className='md:text-white text-blue-500 text-lg' />
                                        <p>Download</p>
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        navigate(`/dashboard/${type}/create`);
                                    }}
                                    className='flex justify-center items-center space-x-2 bg-blue-500 px-4 py-3 rounded-md text-lg font-semibold text-white w-full'
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
                        <div className='inline-flex gap-6'>
                            <button>{`<`}</button>
                            <p>1/10</p>
                            <button>{`>`}</button>
                        </div>
                        <div className='max-h-[80vh] hide-scrollbar overflow-y-scroll'>
                            <div className='p-4'>
                                {
                                    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((ele, index) => (
                                        <img key={index} src={qr} alt={String(ele)} className="h-40 w-40 rounded-lg" />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllCards;