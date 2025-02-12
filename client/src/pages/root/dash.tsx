import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdDelete, MdOutlineNavigateNext } from "react-icons/md";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createQRCode, typeStyles } from "@/lib/helper";
import { GenerateQRCode } from "@/components/rest/generate-qr";
import SideBar from "@/components/rest/sidebar";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/card_types";
import Papa from "papaparse";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const Dashboard = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState<number>(
        Number(searchParams.get("currentIndex")) || 0
    );
    const [currentPage, setCurrentPage] = useState(
        Number(searchParams.get("currentPage")) || 1
    );
    const [countData, setCountData] = useState({
        totalCards: 1,
        filteredCards: 1,
        resultPerPage: 20,
    });
    const [cards, setCards] = useState<Tree[] | Personal[] | MedicalType[] | Creator[] | Animal[] | null>(null);
    const [cardTypes, setCardTypes] = useState<string>(type || "botanical");
    const [open, setOpen] = useState(false);

    const fetchData = async (page: number) => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/cards/user?page=${page}&type=${type}`,
                { withCredentials: true }
            );
            setCards(data.vCards);
            setCountData({
                resultPerPage: data.resultPerPage,
                totalCards: data.count,
                filteredCards: data.filteredCardsCount,
            });
            setCurrentPage(page);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error fetching data");
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
        setSearchParams(prev => {
            prev.set("currentPage", currentPage.toString());
            prev.set("currentIndex", currentIndex.toString());
            return prev;
        }, { replace: true });
    }, [currentPage, currentIndex, cardTypes]);

    const handleNext = () => {
        if (cards) {
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else if (currentPage * countData.resultPerPage < countData.filteredCards) {
                setCurrentPage(prev => prev + 1);
                setCurrentIndex(0);
            }
        }
    };

    const handlePrev = () => {
        if (cards) {
            if (currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
            } else if (currentPage > 1) {
                setCurrentPage(prev => prev - 1);
                setCurrentIndex(cards.length - 1);
            }
        }
    };

    const styles = type && typeStyles[type] ? typeStyles[type] : typeStyles.default;

    const getCurrentCard = () => {
        if (!cards || currentIndex < 0 || currentIndex >= cards.length) {
            toast.error("Something went wrong");
            return null;
        }
        return cards[currentIndex];
    };

    const handleEditCard = () => {
        const card = getCurrentCard();
        if (card) {
            navigate(`/dashboard/${type}/create/${card._id}`);
        } else {
            toast.error("Something went wrong");
        }
    };

    const handleShareCard = () => {
        const card = getCurrentCard();
        if (card) {
            window.navigator.clipboard.writeText(
                `${window.location.protocol}//${window.location.host}/d/${card.shortCode}`
            );
            toast.success("Link has been copied to clipboard");
        } else {
            toast.error("Something went wrong");
        }
    };

    const handleDownloadCard = () => {
        const card = getCurrentCard();
        toast.info(card?.shortCode);
        if (card && card.shortCode && type) {
            const qrCode = createQRCode(type, card.shortCode);

            qrCode.download({
                name: card._id,
                extension: "png"
            });
        }
    };

    const [columns, setColumns] = useState<string[]>([""]);
    const [batchLoading, setBatchLoading] = useState(false);

    const handleAdd = () => {
        setColumns([...columns, ""]);
    };

    const handleChange = (event: any, index: number) => {
        setColumns((prevData: any) => [
            ...prevData.slice(0, index),
            event.target.value,
            ...prevData.slice(index + 1),
        ]);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const fileType = file.name.split('.').pop()?.toLowerCase();

        if (fileType === "csv") {
            handleCSV(file);
        } else {
            toast.warning("Unsupported file type! Please upload a CSV or XLSX file.");
        }
    };

    const handleCSV = (file: File) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.meta.fields && results.meta.fields.includes("name")) {
                    setColumns(results.data.map((d: any) => d["name"]));
                } else {
                    toast.error("CSV file must contain a 'name' column");
                    return;
                }
            },
            error: (error) => {
                console.error("Error parsing CSV:", error);
            },
        });
    };

    const handleDeleteSocial = (label: string) => {
        const normalizedLabel = label.trim().toLowerCase();
        const updatedArr = columns.filter((arr: string) => arr.trim().toLowerCase() != normalizedLabel);
        setColumns(updatedArr);
    }

    const validNames = columns.filter((col) => col && col.length > 0);

    const handleSubmitBatch = async () => {
        setBatchLoading(true);
        if (validNames.length === 0) {
            toast.error("No names specified");
            return;
        }
        try {
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/cards/new/batch?type=${type}`,
                { names: validNames, total: validNames.length },
                { withCredentials: true }
            );
            toast.success("Successfully Created Cards");
            fetchData(currentPage);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error creating cards");
        } finally {
            setOpen(false);
            setBatchLoading(false);
        }
    }

    return (
        <>
            <Helmet>
                <title>Voolata | Dashboard</title>
                <meta name="description" content="This is the dashboard page of Voolata" />
                <meta name="keywords" content="dashboard, voolata" />
            </Helmet>
            {open && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[50%]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold mb-4 flex justify-center">
                                Create {type && type.charAt(0).toUpperCase() + type.slice(1)} Cards
                            </h2>
                            <button className="p-1 border-2 border-gray-400 rounded-full" onClick={() => setOpen(false)}>
                                <RxCross2 size={24} />
                            </button>
                        </div>
                        <div className="w-full flex flex-col md:flex-row justify-center md:justify-evenly space-x-12 gap-2">
                            <div className="w-1/2 mx-auto">
                                <h1 className="text-xl text-gray-600 font-semibold">Import from file</h1>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    disabled={batchLoading}
                                    className="w-full border border-gray-400 p-2 rounded-md"
                                />
                                <p className="mt-6 text-md text-gray-500">* Only CSV files are allowed</p>
                                <p className="text-md text-gray-500">* File must have a "name" column</p>
                            </div>
                            <div className="w-1/2 mx-auto">
                                <div className="flex gap-4">
                                    <h1 className="text-xl text-gray-600 font-semibold">{validNames.length > 0 ? `${validNames.length} Entries` : "Manually enter"}</h1>
                                    {columns.length > 0 && (
                                        <button
                                            type="button"
                                            className="flex justify-center items-center px-2 py-1.5 gap-2 rounded-md bg-gray-200"
                                            onClick={handleAdd}
                                            disabled={batchLoading}
                                        >
                                            <FaPlus /> Add More
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[40vh] overflow-y-scroll hide-scrollbar">
                                    {columns?.map((arr: string, index: number) => (
                                        <div
                                            className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4"
                                            key={index}
                                        >
                                            <div className="flex items-center space-x-4 w-full">
                                                <div className="w-full">
                                                    <input
                                                        type="text"
                                                        id={`name-${index}`}
                                                        name="name"
                                                        value={arr}
                                                        onChange={(e) => handleChange(e, index)}
                                                        placeholder={"Enter card name"}
                                                        autoComplete="off"
                                                        className="peer h-10 w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 text-md font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0"
                                                    />
                                                    <span className="absolute left-0 bottom-0 h-[2px] w-full bg-transparent scale-x-0 border-gray-500 transition-transform duration-300 peer-focus:scale-x-100 peer-focus:bg-gray-900"></span>
                                                </div>
                                                {arr && (
                                                    <button
                                                        type="button"
                                                        className="p-2 text-red-500"
                                                        onClick={() => handleDeleteSocial(arr)}
                                                    >
                                                        <MdDelete size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" disabled={batchLoading} onClick={handleSubmitBatch} className="mt-8 px-4 py-2 bg-indigo-500 text-white rounded-md">
                                    {batchLoading ? "Hold on..." : "Submit"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-center pt-6 pb-16">
                <div className="flex flex-row w-[80%] md:w-[90%] lg:w-[80%] md:space-x-4 lg:space-x-4">
                    <div className="basis-full h-screen md:h-auto md:basis-1/4 lg:basis-1/4 lg:block xl:block">
                        <SideBar />
                    </div>
                    <div className="basis-3/4 hidden md:flex flex-col justify-center items-center lg:max-h-screen">
                        <div
                            className={`w-full h-full flex flex-col justify-start items-center border-2 ${styles.backgroundColor} rounded-lg shadow-lg`}
                        >
                            <div className="mt-4 w-full flex justify-center py-4 rounded-t-lg">
                                <select
                                    className={`bg-gray-300 px-6 py-4 text-white rounded-2xl text-xl font-bold ${styles.textColor} focus:outline-none shadow-md`}
                                    value={cardTypes}
                                    onChange={e => {
                                        setCardTypes(e.target.value);
                                        setCurrentPage(1);
                                        setCurrentIndex(0);
                                        // fetchData(1);
                                        navigate(`/dashboard/${e.target.value}`, { replace: true });
                                    }}
                                >
                                    <option className="bg-slate-200 text-black" value="botanical">
                                        BOTANICAL
                                    </option>
                                    <option className="bg-slate-200 text-black" value="animal">
                                        ANIMAL
                                    </option>
                                    <option className="bg-slate-200 text-black" value="individual">
                                        INDIVIDUAL
                                    </option>
                                    <option className="bg-slate-200 text-black" value="creator">
                                        CREATOR
                                    </option>
                                    <option className="bg-slate-200 text-black" value="medical">
                                        MEDICAL
                                    </option>
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
                                                        className={`p-4 rounded-full ${styles.textColor} text-white flex justify-center items-center hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        onClick={handlePrev}
                                                        disabled={currentPage === 1 && currentIndex === 0}
                                                    >
                                                        <IoIosArrowBack className="w-6 h-6" />
                                                    </button>
                                                    <div className="overflow-hidden flex justify-center items-center w-60 h-84">
                                                        {cards.map((card, index) => (
                                                            <div
                                                                key={card._id}
                                                                className={`flex h-full w-full transition-transform duration-300 ease-in-out ${index === currentIndex ? "block" : "hidden"}`}
                                                                onClick={() => navigate(`/dashboard/cards/card/${type}/${card._id}`)}
                                                            >
                                                                <GenerateQRCode
                                                                    switchTab={true}
                                                                    way="qr-group"
                                                                    card={card}
                                                                    type={type!}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button
                                                        className={`p-4 rounded-full ${styles.textColor} text-white flex justify-center items-center hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        onClick={handleNext}
                                                        disabled={currentPage * countData.resultPerPage >= countData.filteredCards && currentIndex === cards.length - 1}
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
                                    <button
                                        onClick={() => setOpen(true)}
                                        className={`${styles.textColor} hidden md:block text-white px-5 py-3 text-lg font-medium rounded-md`}
                                    >
                                        Create Batch
                                    </button>
                                    <button
                                        onClick={() => navigate(`/dashboard/${type}/create`)}
                                        className={`${styles.textColor} text-white px-5 py-3 text-lg font-medium rounded-md`}
                                    >
                                        New Card
                                    </button>
                                    {cards && cards.length > 0 && (
                                        <>
                                            <button
                                                onClick={handleEditCard}
                                                className={`${styles.textColor} text-white px-5 py-3 text-lg font-medium rounded-md`}
                                            >
                                                Edit Card
                                            </button>
                                            <button
                                                onClick={handleDownloadCard}
                                                className={`${styles.textColor} text-white px-5 py-3 text-lg font-medium rounded-md`}
                                            >
                                                Download
                                            </button>
                                            <button
                                                onClick={handleShareCard}
                                                className={`${styles.textColor} text-white px-5 py-3 text-lg font-medium rounded-md`}
                                            >
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
        </>
    );
};

export default Dashboard;