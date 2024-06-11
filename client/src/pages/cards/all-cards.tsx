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
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/card_types";

interface PropsType {
    card: Tree | Personal | MedicalType | Creator | Animal | null;
    user: User;
    isPaid: boolean;
    type: string;
}

const VCard = ({ card, isPaid, user, type }: PropsType) => {
    const navigate = useNavigate();
    const [qr, setQr] = useState("");

    const generateCode = async () => {
        try {
            if ((isPaid || user.role === "admin") && card) {
                const link = `${window.location.protocol}//${window.location.host}/display?id=${card._id}&type=${type}`;
                const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
                setQr(qre);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        generateCode();
    }, [isPaid, card, user.role, type]);

    return (
        <div className="flex flex-col">
            {isPaid || user.role === "admin" ? (
                <img
                    src={qr}
                    alt={card?._id}
                    className="rounded-lg"
                    onClick={() => navigate(`/dashboard/cards/card?id=${card?._id}&type=${type}`)}
                />
            ) : (
                <img
                    src="/error_qr.jpg"
                    alt="Error Qr"
                    className="rounded-lg"
                    width={250}
                    height={250}
                />
            )}
            <div className="flex items-center justify-center mt-2 text-2xl font-semibold font-Alice">
                {card?.name}
            </div>
        </div>
    );
};

interface OtherPropsType {
    cards: Tree[] | Personal[] | MedicalType[] | Creator[] | Animal[] | null;
    user: User;
    isPaid: boolean;
    type: string;
}

const OtherQR = ({ cards, isPaid, user, type }: OtherPropsType) => {
    return (
        <div className="lg:w-full">
            <div className="flex justify-center pt-[1rem]">
                <p className="font-Philosopher text-lg">
                    Here are all your {type.charAt(0).toUpperCase() + type.slice(1)} cards!
                </p>
            </div>
            <div className="flex flex-col justify-center lg:w-[90%] lg:h-full lg:my-[2rem] mt-4 overflow-y-auto max-h-[80vh]">
                {cards?.map((card: Tree | Personal | MedicalType | Creator | Animal, index: number) => (
                    <div className="border px-6 py-6 m-2 rounded-lg shadow-lg bg-slate-100" key={index}>
                        <VCard
                            key={card._id}
                            type={type!}
                            card={card}
                            isPaid={isPaid}
                            user={user!}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

type CardType = TreeResponse | PersonalResponse | MedicalResponse | CreatorResponse | AnimalResponse;

const AllCards = () => {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const type = search.get("type");
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const { isPaid, user } = useSelector((state: RootState) => state.userReducer);

    const [currentPage, setCurrentPage] = useState(1);
    const [countData, setCountData] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showOther, setShowOther] = useState<boolean>(false);
    const [cards, setCards] = useState<Tree[] | Personal[] | MedicalType[] | Creator[] | Animal[] | null>();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (
                ["botanical", "individual", "medical", "creator", "animal"].includes(type!)
            ) {
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
            case 'botanical':
                return 'green';
            case 'medical':
                return 'blue';
            case 'creator':
                return 'red';
            case 'animal':
                return 'red';
            case 'individual':
                return 'blue';
            default:
                return 'green';
        }
    }

    const color = getColorClasses(type!);

    return (
        <>
            <div className="lg:flex lg:flex-row lg:w-full lg:mt-2 lg:max-h-screen">
                <div className="lg:flex lg:flex-col lg:w-full">
                    <div
                        className={`font-Kanit ${showOther ? "h-[6rem]" : "h-[34rem] rounded-b-[4rem]"} lg:rounded-none lg:shadow-xl z-10 relative shadow-lg lg:rounded-t-xl bg-${color}-200`}
                    >
                        <div className="py-4 flex justify-center">
                            <div className="flex justify-center basis-1/2">
                                <button
                                    onClick={() => setShowOther(false)}
                                    className={`px-4 py-4 rounded-2xl hover:cursor-pointer ${!showOther && `shadow-lg bg-${color}-500 hover:bg-${color}-600`}`}
                                >
                                    <div className="flex flex-row">
                                        <div className="flex items-center px-2">
                                            <BsQrCodeScan className={`w-[1rem] h-[1rem] ${!showOther && "text-white"}`} />
                                        </div>
                                        <div className={`flex items-center font-semibold ${!showOther && "text-white"}`}>
                                            {type && type.charAt(0).toUpperCase() + type.slice(1)} Data
                                        </div>
                                    </div>
                                </button>
                            </div>

                            <div className="basis-1/2 flex justify-center lg:hidden">
                                <button
                                    onClick={() => setShowOther(true)}
                                    className={`px-4 py-4 rounded-2xl hover:cursor-pointer ${showOther && `shadow-lg bg-${color}-500 hover:bg-${color}-600`}`}
                                >
                                    <div
                                        className={`flex flex-row text-${color}-700`}
                                    >
                                        <div className="flex items-center px-2">
                                            <BsQrCodeScan className={`w-[1rem] h-[1rem] ${showOther && "text-white"}`} />
                                        </div>
                                        <div className={`flex items-center font-semibold ${showOther && "text-white"}`}>Other QRs</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {!showOther && (
                            <div className="flex flex-col py-6">
                                <div className="flex justify-center">
                                    <p className="">Share this QR Code to share your</p>
                                </div>
                                <div className="flex justify-center font-bold text-2xl font-Alice">
                                    {type && type.charAt(0).toUpperCase() + type.slice(1)} Data
                                </div>
                            </div>
                        )}



                        {!showOther && (
                            <div className="flex flex-row pt-10 pb-6 lg:hidden">
                                <div className="basis-1/5 flex items-center justify-center">
                                    <div className={`w-[2.5rem] h-[2.5rem] rounded-full bg-slate-300 flex justify-center items-center hover:cursor-pointer ${(!isPaid && user?.role !== "admin") ? "hover:cursor-not-allowed" : "hover:cursor-pointer"}`}>
                                        <IoIosArrowBack
                                            className={`w-[2rem] h-[2rem]`}
                                            onClick={prevQR}
                                        />
                                    </div>
                                </div>
                                <div className="basis-3/5 relative h-[14rem] ">
                                    <div className="flex flex-row justify-center">
                                        {cards?.map((card, index) => (
                                            <div
                                                className={`absolute block ml-[calc(-100%*${index})]${index === currentIndex ? "" : " hidden"
                                                    }`}
                                                key={index}
                                            >
                                                <VCard key={card._id} type={type!} card={card} isPaid={isPaid} user={user!} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="basis-1/5 flex justify-center items-center">
                                    <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-slate-300 flex justify-center items-center hover:cursor-pointer">
                                        <MdOutlineNavigateNext
                                            className="w-[2rem] h-[2rem]"
                                            onClick={nextQR}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}



                        <div className={`lg:flex lg:flex-col hidden bg-${color}-200`}>

                            <div>
                                <div className="flex flex-row pt-10 pb-6">
                                    <div className="basis-1/5 flex items-center justify-center">
                                        <div className={`w-[2.5rem] h-[2.5rem] rounded-full bg-slate-300 flex justify-center items-center hover:cursor-pointer ${(!isPaid && user?.role !== "admin") ? "hover:cursor-not-allowed" : "hover:cursor-pointer"}`}>
                                            <IoIosArrowBack
                                                className="w-[2rem] h-[2rem]"
                                                onClick={prevQR}
                                            />
                                        </div>
                                    </div>
                                    <div className="basis-3/5 relative h-[14rem] ">
                                        <div className="flex flex-row justify-center">
                                            {cards?.map((card, index) => (
                                                <div
                                                    className={`absolute block ml-[calc(-100%*${index})]${index === currentIndex ? "" : " hidden"
                                                        }`}
                                                    key={index}
                                                >
                                                    <VCard key={card._id} type={type!} card={card} isPaid={isPaid} user={user!} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="basis-1/5 flex justify-center items-center">
                                        <div className={`w-[2.5rem] h-[2.5rem] rounded-full bg-slate-300 flex justify-center items-center hover:cursor-pointer ${(!isPaid && user?.role !== "admin") ? "hover:cursor-not-allowed" : "hover:cursor-pointer"}`}>
                                            <MdOutlineNavigateNext
                                                className="w-[2rem] h-[2rem]"
                                                onClick={nextQR}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className={`-mb-4`}>
                                <div className="py-6 -mt-[2rem]">
                                    <div className="mt-[4rem] flex flex-row">
                                        <div className="basis-1/2 flex justify-end pr-[2rem]">
                                            <button
                                                className={`px-10 pt-2 pb-4 rounded-md hover:cursor-pointer text-white shadow-lg bg-${color}-500 hover:bg-${color}-600 disabled:bg-${color}-500 disabled:hover:cursor-not-allowed`}
                                                disabled={!isPaid && user?.role !== "admin"}
                                            >
                                                <div className="flex flex-col">
                                                    <div className="flex justify-center items-center">
                                                        <IoShareOutline className="w-[1.5rem] h-[1.5rem] pr-2" />
                                                    </div>
                                                    <div className="flex items-center font-semibold">
                                                        Share Card
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                        <div className="basis-1/2 flex justify-start pl-[1rem]">
                                            <button
                                                className={`px-8 pt-2 pb-4 mr-8 rounded-md hover:cursor-pointer text-white shadow-xl bg-${color}-500 hover:bg-${color}-600 disabled:bg-${color}-500 disabled:hover:cursor-not-allowed`}
                                                disabled={!isPaid || user?.role !== "admin"}
                                            >
                                                <div className="flex flex-col">
                                                    <div className="flex justify-center items-center">
                                                        <IoDownloadOutline className="w-[1.5rem] h-[1.5rem] pr-2" />
                                                    </div>
                                                    <div className="flex items-center font-semibold">
                                                        Download Card
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="">
                                        <div className="w-full ">
                                            <div className="flex justify-center w-full py-6">
                                                <button
                                                    className={`px-[6rem] py-2 text-white rounded-md hover:cursor-pointer text-lg font-Kanit shadow-lg bg-${color}-500 hover:bg-${color}-600`}
                                                    onClick={() => {
                                                        navigate(`/dashboard/${type}/create`);
                                                    }}
                                                >
                                                    Add a new Vcard
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                {!showOther && (
                    <div>
                        <div className={`py-6 bg-slate-100 -mt-[2rem] lg:hidden`}>
                            <div className="mt-[4rem] flex flex-row">
                                <div className="basis-1/2 flex justify-center hover:cursor-pointer">
                                    <button
                                        className={`px-12 py-2 rounded-3xl hover:cursor-pointer shadow-lg bg-${color}-300`}
                                    >
                                        <div className="flex flex-col">
                                            <div className="flex justify-center items-center">
                                                <IoShareOutline className="w-[2rem] h-[2rem]" />
                                            </div>
                                            <div className="flex items-center pt-2 font-semibold">
                                                Share
                                            </div>
                                        </div>
                                    </button>
                                </div>
                                <div className="basis-1/2 flex justify-center">
                                    <button
                                        className={`px-10 py-8 rounded-3xl hover:cursor-pointer shadow-xl bg-${color}-300`}
                                    >
                                        <div className="flex flex-col">
                                            <div className="flex justify-center items-center">
                                                <IoDownloadOutline className="w-[2rem] h-[2rem]" />
                                            </div>
                                            <div className="flex items-center pt-2 font-semibold">
                                                Download
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:hidden">
                            <div className="flex justify-center w-full py-6 bg-slate-100">
                                <button
                                    className={`px-[5rem] py-3 text-white rounded-lg hover:cursor-pointer text-lg font-Kanit shadow-lg bg-${color}-500`}
                                    onClick={() => {
                                        navigate(`/dashboard/${type}/create`);
                                    }}
                                >
                                    Add a new Vcard
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                <div className={`${showOther ? 'block' : 'hidden'} lg:block lg:basis-1/2 lg:w-full`}>
                    <OtherQR cards={cards!} isPaid={isPaid} user={user!} type={type!} />
                </div>
            </div>
        </>
    );
};

export default AllCards;
