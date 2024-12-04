import SideBar from "@/components/rest/sidebar";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { CardType, createQRCode, GenerateQRCode } from "../cards/all-cards";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/card_types";
import { toast } from "react-toastify";

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useSearchParams();
    const type = search.get("type");
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
        setSearch({ ...search, type: "botanical" }, { replace: true });
        setCardTypes("botanical");
    }, []);

    useEffect(() => {
        if (type && type !== cardTypes) {
            setSearch({...search, type: cardTypes }, { replace: true });
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

    const typeStyles: Record<string, { backgroundColor: string, textColor: string, mdBackgroundColor: string, iconColor: string }> = {
        botanical: { backgroundColor: "bg-green-200", textColor: "bg-green-500", mdBackgroundColor: "md:bg-green-500", iconColor: "text-green-500" },
        individual: { backgroundColor: "bg-blue-200", textColor: "bg-blue-500", mdBackgroundColor: "md:bg-blue-500", iconColor: "text-blue-500" },
        animal: { backgroundColor: "bg-red-200", textColor: "bg-red-500", mdBackgroundColor: "md:bg-red-500", iconColor: "text-red-500" },
        creator: { backgroundColor: "bg-cyan-200", textColor: "bg-cyan-500", mdBackgroundColor: "md:bg-cyan-500", iconColor: "text-cyan-500" },
        medical: { backgroundColor: "bg-indigo-200", textColor: "bg-indigo-500", mdBackgroundColor: "md:bg-indigo-500", iconColor: "text-indigo-500" },
        default: { backgroundColor: "bg-gray-200", textColor: "bg-gray-500", mdBackgroundColor: "md:bg-gray-500", iconColor: "text-gray-500" }
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
            navigate(`/dashboard/${type}/create?${type}Id=${card?._id}`);
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
                extension: "png" // jpeg //svg
            });
        }
    }

    return (
        <div className="flex justify-center pt-6 pb-16 bg-gray-100">
            <div className="flex flex-row w-[80%] md:w-[90%] lg:w-[80%] md:space-x-4 lg:space-x-4">
                <div className="basis-full md:basis-1/4 lg:basis-1/4 lg:block xl:block">
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

                                                {/* Previous Button */}
                                                <button
                                                    className={`p-4 rounded-full ${styles.textColor} text-white black flex justify-center items-center hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    onClick={handlePrev}
                                                    disabled={currentIndex === 0}
                                                >
                                                    <IoIosArrowBack className="w-6 h-6" />
                                                </button>

                                                {/* Cards */}
                                                <div className="overflow-hidden flex justify-center items-center w-60 h-84">
                                                    {cards.map((card, index) => (
                                                        <div
                                                            key={card._id}
                                                            className={`flex h-full w-full transition-transform duration-300 ease-in-out ${index === currentIndex ? "block" : "hidden"
                                                                }`}
                                                            onClick={() =>
                                                                navigate(`/dashboard/cards/card?id=${card._id}&type=${type}`)
                                                            }
                                                        >
                                                            <GenerateQRCode way="qr-group" card={card} type={type!} />
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Next Button */}
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
                                <button onClick={handleEditCard} className={`${styles.textColor} text-white px-5 py-3 text-lg font-medium rounded-md`}>
                                    Edit Card
                                </button>
                                <button onClick={handleDownloadCard} className={`${styles.textColor} text-white px-5 py-3 text-lg font-medium rounded-md`}>
                                    Download
                                </button>
                                <button onClick={handleShareCard} className={`${styles.textColor} text-white px-5 py-3 text-lg font-medium rounded-md`}>
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
