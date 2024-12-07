import SideBar from "@/components/rest/sidebar";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { CardType } from "../cards/all-cards";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/card_types";
import { toast } from "react-toastify";
import { createQRCode, typeStyles } from "@/lib/helper";
import { GenerateQRCode } from "@/components/rest/generate-qr";

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { type } = useParams();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [countData, setCountData] = useState(1);
    const [cards, setCards] = useState<Tree[] | Personal[] | MedicalType[] | Creator[] | Animal[] | null>();
    const [cardTypes, setCardTypes] = useState<string>(type || "botanical");

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

    useEffect(() => {
        if (type && type !== cardTypes) {
            navigate(`/dashboard/${cardTypes}`, { replace: true });
        }
    }, [type, cardTypes]);

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

    const getCurrentCard = () => {
        if (!cards || currentIndex < 0 || currentIndex >= cards.length) {
            return null;
        }
        return cards[currentIndex];
    };

    const handleEditCard = () => {
        const card = getCurrentCard();
        if (card) {
            navigate(`/dashboard/${type}/create/${card?._id}`);
        } else {
            toast.error("Something went wrong");
        }
    }

    const handleShareCard = () => {
        const card = getCurrentCard();
        if (card) {
            window.navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/d/${card.shortCode}`);
            toast.success("Link has been copied to clipboard");
        } else {
            toast.error("Something went wrong");
        }
    }

    const handleDownloadCard = () => {
        const card = getCurrentCard();
        if (card && card.shortCode && type) {
            const qrCode = createQRCode(type, card.shortCode);
    
            qrCode.download({
                name: cards?.[currentIndex]._id,
                extension: "png"
            });
        }
    }

    return (
        <div className="flex justify-center pt-6 pb-16">
            <div className="flex flex-row w-[80%] md:w-[90%] lg:w-[80%] md:space-x-4 lg:space-x-4">
                <div className="basis-full h-screen md:h-auto md:basis-1/4 lg:basis-1/4 lg:block xl:block">
                    <SideBar />
                </div>
                <div className="basis-3/4 hidden md:flex flex-col justify-center items-center lg:max-h-screen">
                    <div className={`w-full h-full flex flex-col justify-start items-center border-2 ${styles.backgroundColor} rounded-lg shadow-lg`}>

                        <div className="mt-4 w-full flex justify-center py-4 rounded-t-lg">
                            <select
                                className={`bg-gray-300 px-6 py-4 text-white rounded-2xl text-xl font-bold ${styles.textColor} focus:outline-none shadow-md`}
                                value={cardTypes}
                                onChange={(e) => setCardTypes(e.target.value)}
                            >
                                <option className="bg-slate-200 text-black" value="botanical">BOTANICAL</option>
                                <option className="bg-slate-200 text-black" value="animal">ANIMAL</option>
                                <option className="bg-slate-200 text-black" value="individual">INDIVIDUAL</option>
                                <option className="bg-slate-200 text-black" value="creator">CREATOR</option>
                                <option className="bg-slate-200 text-black" value="medical">MEDICAL</option>
                            </select>
                        </div>
                        <div className="mt-8 flex flex-row w-full justify-between items-center px-6 py-6">

                            <div className="flex flex-col justify-center items-center w-full lg:w-3/4 space-y-6">
                                {loading ? (
                                    <div>
                                        <Loader2 className="text-center animate-spin" />
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col items-center py-4 space-y-4">
                                        {cards && cards.length > 0 ? (
                                            <div className="flex flex-row justify-between items-center space-x-8">
                                                <button
                                                    className={`p-4 rounded-full ${styles.textColor} text-white black flex justify-center items-center hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    onClick={handlePrev}
                                                    disabled={currentIndex === 0}
                                                >
                                                    <IoIosArrowBack className="w-6 h-6" />
                                                </button>
                                                <div className="overflow-hidden flex justify-center items-center w-60 h-84">
                                                    {cards.map((card, index) => (
                                                        <div
                                                            key={card._id}
                                                            className={`flex h-full w-full transition-transform duration-300 ease-in-out ${index === currentIndex ? "block" : "hidden"
                                                                }`}
                                                            onClick={() =>
                                                                navigate(`/dashboard/cards/card/${type}/${card._id}`)
                                                            }
                                                        >
                                                            <GenerateQRCode way="qr-group" card={card} type={type!} />
                                                        </div>
                                                    ))}
                                                </div>
                                                <button
                                                    className={`p-4 rounded-full ${styles.textColor} text-white flex justify-center items-center hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    onClick={handleNext}
                                                    disabled={currentIndex === cards.length - 1}
                                                >
                                                    <MdOutlineNavigateNext className="w-6 h-6" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-gray-600 text-lg">No Cards Yet</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="hidden lg:flex flex-col justify-start space-y-4 w-1/4">
                                <button onClick={() => navigate(`/dashboard/${type}/create`)} className={`${styles.textColor} text-white px-5 py-3 text-lg font-medium rounded-md`}>
                                    New Card
                                </button>
                                {cards && cards.length > 0 && (
                                    <>
                                        <button onClick={handleEditCard} className={`${styles.textColor} text-white px-5 py-3 text-lg font-medium rounded-md`}>
                                            Edit Card
                                        </button>
                                        <button onClick={handleDownloadCard} className={`${styles.textColor} text-white px-5 py-3 text-lg font-medium rounded-md`}>
                                            Download
                                        </button>
                                        <button onClick={handleShareCard} className={`${styles.textColor} text-white px-5 py-3 text-lg font-medium rounded-md`}>
                                            Share
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
