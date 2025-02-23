import { useEffect, useRef, useState } from "react";
import { CiMenuKebab, CiSearch } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import QRCode from "@/components/cards/qr-code";
import CardQR from "@/components/cards/card-qr";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { useMediaQuery } from "react-responsive";
import { FiDownload, FiEye, FiPlus } from "react-icons/fi";
import { BsQrCodeScan, BsSliders } from "react-icons/bs";
import useCardTraversal from "@/hooks/useCardTraversal";
import { LuPencilLine } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { IoShareSocialOutline } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import { NoQR } from "@/constants/cards/actions";
import { ICard } from "@/types/type";
import Papa from "papaparse";
import Backdrop from "@/components/cards/backdrop";
import API from "@/config/apiConfig";

const categories = [
    {
        id: 0,
        name: 'All',
        type: "ALL"
    },
    {
        id: 1,
        name: 'Botany',
        type: "BOTANICAL"
    },
    {
        id: 2,
        name: 'Animal',
        type: "ANIMAL"
    },
    {
        id: 3,
        name: 'Creator',
        type: "CREATOR"
    },
    {
        id: 4,
        name: 'Medical',
        type: "MEDICAL"
    },
    {
        id: 5,
        name: 'Individual',
        type: "INDIVIDUAL"
    }
]

export type CardCategory = "ALL" | "INDIVIDUAL" | "BOTANICAL" | "ANIMAL" | "CREATOR" | "MEDICAL";
export type ActiveTabs = "qr" | "card";

export interface FetchUserCardsResponse {
    success: boolean;
    count: number;
    resultPerPage: number;
    cards: ICard[];
    filteredCardsCount: number;
}

const Dashboard = () => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const paramsType = (searchParams.get("type") as CardCategory) || "ALL";
    const [type, setType] = useState<CardCategory>(paramsType);
    const [open, setOpen] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [openBulk, setOpenBulk] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState<ICard[] | null>(null);
    const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
    const [counts, setCounts] = useState({
        currentPage: Number(searchParams.get("currentPage")) || 1,
        resultPerPage: 20,
        filteredCards: 1,
        totalCards: 1
    });
    const [activeTab, setActiveTab] = useState<ActiveTabs>(searchParams.get("activeTab") as ActiveTabs || "qr");
    const [isMobileCardType, setIsMobileCardType] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const cardDropdownRef = useRef<HTMLDivElement | null>(null);
    const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const fetchData = async (link: string) => {
        try {
            const { data }: { data: FetchUserCardsResponse } = await API.get(link);
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

    const isMobile = useMediaQuery({ maxWidth: 628 });

    useEffect(() => {
        if (isMobile && open) {
            navigate(`/dashboard/card?type=${type}`)
        }
    }, [isMobile, open]);

    useEffect(() => {
        const queryParams = [
            `page=${counts.currentPage}`,
            `type=${type}`,
            `keyword=${keyword}`
        ].filter(Boolean).join("&");

        setLoading(true);

        setCards([]);

        if (type && ["ALL", "BOTANICAL", "INDIVIDUAL", "MEDICAL", "CREATOR", "ANIMAL"].includes(type)) {
            const link = `${import.meta.env.VITE_BASE_URL}/cards/user?${queryParams}`;
            fetchData(link);
        }

        setLoading(false);

    }, [type, counts.currentPage]);

    const debounceFetch = (callback: () => void, delay: number) => {
        let timeout: NodeJS.Timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(callback, delay);
        };
    };

    useEffect(() => {
        setLoading(true);
        const debouncedSearch = debounceFetch(() => {
            setCounts(prev => ({ ...prev, currentPage: 1 }));
            fetchData(`${import.meta.env.VITE_BASE_URL}/cards/user?page=1&type=${type}&keyword=${keyword}`);
            setSearchParams(prev => {
                prev.set("keyword", keyword);
                prev.set("currentPage", "1");
                return prev;
            }, { replace: true });
            setLoading(false);
        }, 2000);
        debouncedSearch();
    }, [keyword]);

    const { currentIndex, setCurrentIndex, handleNext, handlePrev, hasNext, hasPrev, handleShare, handleDownload, downloadDivAsImage } = useCardTraversal(cards, counts, setCounts);

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
        if (open || openUpload) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [open, openUpload]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            // if (cardDropdownRef.current && !cardDropdownRef.current.contains(event.target as Node)) {
            //     setActiveDropdownId(null);
            // }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [columns, setColumns] = useState<string[]>([""]);
    const [batchLoading, setBatchLoading] = useState(false);
    const [batchCardName, setBatchCardName] = useState("");
    const [batchQuantity, setBatchQuantity] = useState<number>(0);
    const [batchCardType, setBatchCardType] = useState<"INDIVIDUAL" | "BOTANICAL" | "ANIMAL" | "CREATOR" | "MEDICAL">(type !== "ALL" ? type : "BOTANICAL");

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

    const validNames = columns.filter((col) => col && col.length > 0);

    const handleSubmitBatch = async (batchType: "file" | "qunatity") => {
        setBatchLoading(true);
        if (batchType === "file" && validNames.length === 0) {
            toast.error("No names specified");
            return;
        }
        if (batchType === "qunatity" && (!batchCardName || batchQuantity === 0)) {
            toast.error("Please specify a card name and quantity");
            return;
        }
        try {
            const batchBody: any = {};
            if (batchType === "file") {
                batchBody.names = validNames;
            } else {
                batchBody.name = batchCardName;
                batchBody.quantity = batchQuantity;
            }
            await API.post(`/cards/new/batch?type=${batchCardType}`, batchBody);
            toast.success("Successfully Created Cards");
            // fetchData(counts.currentPage);
            fetchData(`/cards/user?page=1&type=${type}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error creating cards");
        } finally {
            setOpenUpload(false);
            setOpenBulk(false);
            setBatchLoading(false);
        }
    }

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <Backdrop />
            <div className="mx-4 sm:mx-16">
                <h1 className="text-3xl mt-14 md:mt-5 font-semibold">Dashboard</h1>
                <form className="relative w-full mx-auto sm:w-72 lg:w-96 mt-5 sm:ml-0">
                    <CiSearch className="absolute left-3 top-3 w-5 h-5" />
                    <input
                        type="text"
                        className="border border-gray-500 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none"
                        placeholder="Search..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </form>
            </div>

            <div className="flex justify-between items-center mx-4 sm:mx-16 mt-5">
                <h2 className="text-xl sm:text-2xl font-semibold">My QR Codes</h2>
                <div className="flex items-center gap-3 sm:gap-5 relative" ref={dropdownRef}>
                    <RiDeleteBin6Line onClick={() => setOpenDelete(true)} size={24} className="cursor-pointer hover:opacity-75" />
                    <button
                        className="flex items-center justify-center bg-[#454545] text-white rounded-full sm:rounded-md p-1 md:px-3 md:py-1 text-sm font-medium hover:bg-gray-700 transition"
                        onClick={() => setIsDropdownOpen(prev => !prev)}
                    >
                        <FiPlus size={24} />
                        <span className="hidden sm:inline ml-2 text-lg">Add</span>
                    </button>
                    {isDropdownOpen && (
                        <div
                            onClick={() => setIsDropdownOpen(false)}
                            className="absolute right-2 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg"
                        >
                            <ul className="py-2">
                                {type !== "ALL" && (
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => navigate(`/dashboard/${type}/create`)}
                                    >
                                        Create QR
                                    </li>
                                )}
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setOpenBulk(true);
                                        setBatchCardType(type !== "ALL" ? type : "BOTANICAL");
                                    }}
                                >
                                    Bulk QR
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setOpenUpload(true);
                                        setBatchCardType(type !== "ALL" ? type : "BOTANICAL");
                                    }}
                                >
                                    Import Bulk
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="block md:hidden mt-2 border border-gray-500 rounded-lg py-2 px-3 mx-4 sm:mx-16">
                <div className="flex justify-between items-center">
                    {isMobileCardType ? (
                        <p className="font-normal">QR code type</p>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            <input type="checkbox" onChange={() => { }} checked={true} className="w-4 h-4" />
                            <p className="capitalize">{type}</p>
                        </div>
                    )}
                    {isMobileCardType ? (
                        <div className="p-1 bg-gray-200 rounded-full">
                            <RxCross2 onClick={() => setIsMobileCardType(false)} size={18} />
                        </div>
                    ) : (
                        <BsSliders onClick={() => setIsMobileCardType(true)} size={24} />
                    )}
                </div>
                {isMobileCardType && <hr className="my-2" />}
                {isMobileCardType && (
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <div
                                key={category.id}
                                onClick={() => {
                                    setType(category.type as CardCategory);
                                    setIsMobileCardType(false);
                                }}
                            >
                                <div className="border border-gray-400 rounded-md py-1 px-2 flex items-center gap-2">
                                    <input type="checkbox" onChange={() => setType(category.type as CardCategory)} checked={category.type === type} className="w-4 h-4" />
                                    {category.name}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="hidden md:flex font-semibold border-b border-[#E1E1E1] mx-4 sm:mx-16 mt-5 gap-4 overflow-x-auto">
                {categories.map(category => (
                    <div
                        key={category.id}
                        className="cursor-pointer px-2 sm:px-4"
                        onClick={() => setType(category.type as CardCategory)}
                    >
                        <span className={`pb-1 ${type === category.type ? 'text-blue-600' : ''}`}>{category.name}</span>
                        <div className={`h-[2px] w-full ${type === category.type ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                    </div>
                ))}
            </div>

            {open && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[999]"
                    onClick={() => setOpen(false)}
                >
                    <div className="flex flex-col justify-between items-center gap-16 h-full w-full py-12">
                        <div onClick={(e) => e.stopPropagation()} className="flex justify-center items-center gap-6 text-white">
                            {/* <button onClick={() => setActiveTab("qr")} className={activeTab === "qr" ? "underline" : ""}> */}
                            <button onClick={() => setActiveTab("qr")} className={`flex justify-center items-center gap-2 px-3 py-2 ${activeTab === "qr" ? "bg-white text-black rounded-md" : ""}`}>
                                <BsQrCodeScan size={20} />
                                <p className='text-md font-semibold'>QR CODE</p>
                            </button>
                            <button onClick={() => setActiveTab("card")} className={`flex justify-center items-center gap-2 px-3 py-2 ${activeTab === "card" ? "bg-white text-black rounded-md" : ""}`}>
                                <BsQrCodeScan size={20} />
                                <p className='text-md font-semibold'>CARD QR</p>
                            </button>
                        </div>
                        <div className="flex flex-row justify-between items-center w-full px-6">
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
                                    <div key={index} onClick={(e) => e.stopPropagation()} className="overflow-hidden flex flex-col justify-center items-center space-y-4">
                                        <div
                                            className={`transition-transform duration-300 ease-in-out text-white ${index === currentIndex ? 'block' : 'hidden'}`}
                                            onClick={() => navigate(`/dashboard/cards/card/${type}/${card._id}`)}
                                        >
                                            {activeTab === "qr" ? (
                                                <QRCode shortCode={card.shortCode} type={card.type} />
                                            ) : (
                                                <CardQR name={card.data.name} shortCode={card.shortCode} type={card.type} ref={cardRef} />
                                            )}
                                        </div>
                                        <p className={`text-white ${index === currentIndex ? 'block' : 'hidden'}`}>{card.shortCode}{activeTab === "qr" ? "?type=qr" : "?type=card"}</p>
                                    </div>
                                )) : (
                                    <div className="flex justify-center items-center">
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
                        <div onClick={(e) => e.stopPropagation()} className="flex justify-center items-center gap-6">
                            <button
                                className="bg-[rgb(0,0,0,0.24)] p-3 cursor-pointer hover:opacity-75 rounded-full"
                                onClick={activeTab === "card" ? downloadDivAsImage : handleDownload}
                            >
                                <FiDownload size={24} className="text-white" />
                            </button>
                            <button
                                className="bg-[rgb(0,0,0,0.24)] p-3 cursor-pointer hover:opacity-75 rounded-full"
                                onClick={handleShare}
                            >
                                <IoShareSocialOutline size={24} className="text-white" />
                            </button>
                            <button
                                className="bg-[rgb(0,0,0,0.24)] p-3 cursor-pointer hover:opacity-75 rounded-full"
                                onClick={() => navigate(`/dashboard/${cards && cards[currentIndex].type}/create/${cards && cards[currentIndex]._id}`)}
                            >
                                <LuPencilLine size={24} className="text-white" />
                            </button>
                            <button className="bg-[rgb(0,0,0,0.24)] p-3 cursor-pointer hover:opacity-75 rounded-full">
                                <RiDeleteBin6Line size={24} className="text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {openUpload && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[999]"
                    onClick={() => setOpenUpload(false)}
                >
                    <div onClick={(e) => e.stopPropagation()} className="bg-white w-[50%] h-[70vh] rounded-md flex flex-col justify-between items-center px-14 py-12 gap-2 relative">
                        <div className="cursor-pointer absolute top-0 right-0 p-4">
                            <RxCross1 onClick={() => setOpenUpload(false)} size={24} />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-600">Import Your File</h1>
                        <p className="text-gray-400 text-sm px-14">Easily create multiple QR codes in one go by uploading your file. Supported file formats: CSV, Excel (.xlsx), and TXT.</p>
                        {validNames.length > 0 ? (
                            <div className="flex flex-col items-center justify-center gap-6 w-full">
                                <select
                                    value={batchCardType}
                                    onChange={(e) => setBatchCardType(e.target.value as "INDIVIDUAL" | "BOTANICAL" | "ANIMAL" | "CREATOR" | "MEDICAL")}
                                    className="px-4 py-3 w-full md:w-3/12 rounded-md border border-gray-600 outline-none"
                                >
                                    <option value="INDIVIDUAL">INDIVIDUAL</option>
                                    <option value="BOTANICAL">BOTANICAL</option>
                                    <option value="ANIMAL">ANIMAL</option>
                                    <option value="MEDICAL">MEDICAL</option>
                                    <option value="CREATOR">CREATOR</option>
                                </select>
                                <p className="text-xl font-semibold text-gray-500">Uploaded Names - {validNames.length}</p>
                                <button
                                    className="px-4 py-3 w-1/2 text-lg rounded-md border border-red-600 bg-red-600 text-white outline-none"
                                    onClick={() => setColumns([])}
                                >
                                    Remove All
                                </button>
                                <button
                                    className="px-4 py-3 w-1/2 text-lg rounded-md border border-gray-600 bg-gray-600 text-white outline-none"
                                    onClick={() => handleSubmitBatch("file")}
                                >
                                    Submit
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        id="dropzone-file"
                                        onChange={handleFileUpload}
                                        disabled={batchLoading}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {openBulk && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[999]"
                    onClick={() => setOpenBulk(false)}
                >
                    <div onClick={(e) => e.stopPropagation()} className="bg-white w-full md:w-[50%] h-[50vh] rounded-md flex flex-col justify-between items-center px-4 md:px-14 py-12 gap-2 relative">
                        <div className="cursor-pointer absolute top-0 right-0 p-4">
                            <RxCross1 onClick={() => setOpenBulk(false)} size={24} />
                        </div>
                        <h1 className="text-2xl text-center font-semibold text-gray-600">Bulk QR</h1>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full">
                            <select
                                value={batchCardType}
                                onChange={(e) => setBatchCardType(e.target.value as "INDIVIDUAL" | "BOTANICAL" | "ANIMAL" | "CREATOR" | "MEDICAL")}
                                className="px-4 py-3 w-full md:w-3/12 rounded-md border border-gray-600 outline-none"
                            >
                                <option value="INDIVIDUAL">INDIVIDUAL</option>
                                <option value="BOTANICAL">BOTANICAL</option>
                                <option value="ANIMAL">ANIMAL</option>
                                <option value="MEDICAL">MEDICAL</option>
                                <option value="CREATOR">CREATOR</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Name"
                                value={batchCardName}
                                onChange={(e) => setBatchCardName(e.target.value)}
                                className="px-4 py-3 w-full md:w-6/12 rounded-md border border-gray-600 outline-none"
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={batchQuantity}
                                onChange={(e) => setBatchQuantity(Number(e.target.value))}
                                className="px-4 py-3 w-full md:w-3/12 rounded-md border border-gray-600 outline-none"
                            />
                        </div>
                        <button
                            disabled={!batchCardName || !batchQuantity}
                            onClick={() => handleSubmitBatch("qunatity")}
                            className="px-4 py-3 w-1/2 text-lg rounded-md border border-gray-600 bg-gray-600 text-white outline-none"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}

            {openDelete && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[999]"
                    onClick={() => setOpenDelete(false)}
                >
                    <div onClick={(e) => e.stopPropagation()} className="bg-white w-[90%] md:w-[50%] h-[50vh] rounded-md flex flex-col justify-between items-center px-4 md:px-14 py-4 md:py-12 gap-2 relative">
                        <div className="cursor-pointer absolute top-0 right-0 p-4">
                            <RxCross1 onClick={() => setOpenDelete(false)} size={24} />
                        </div>
                        <h1 className="text-2xl text-center font-semibold text-red-600">Delete</h1>
                        <p className="text-lg font-semibold">some delete text</p>
                        <button className="px-4 py-3 w-1/2 text-lg rounded-md border border-gray-600 bg-gray-600 text-white outline-none">Submit</button>
                    </div>
                </div>
            )}

            <div className="hidden lg:block border rounded-lg mx-4 sm:mx-16 mt-5 overflow-x-auto">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b">
                    <div className="flex items-center gap-3 w-[450px]">
                        <input type="checkbox" className="w-4 h-4" />
                        <div className="font-semibold text-sm sm:text-base">Name</div>
                    </div>
                    <div className="hidden md:flex w-full justify-between text-sm font-semibold">
                        <div className="w-[100px]">Short Code</div>
                        <div className="w-[100px]">Type</div>
                        <div className="w-[150px]">Created At</div>
                        <div className="w-[180px] text-center">
                            Actions
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader2 className="text-center animate-spin" />
                    </div>
                ) : cards && cards.length > 0 ? (type === "ALL" ? cards : cards.filter(card => card.type === type)).map(card => (
                    <div
                        key={card._id}
                        onClick={() => navigate(`/dashboard/cards/card/${card.type}/${card._id}`)}
                        className="flex items-center justify-between px-4 py-3 cursor-pointer border-t"
                    >
                        <div className="flex items-center gap-3 w-[450px]">
                            <input type="checkbox" className="w-4 h-4" />
                            <div className="">{card.data.name}</div>
                        </div>
                        <div className="hidden md:flex w-full justify-between text-sm">
                            <div className="w-[100px]">{card.shortCode}</div>
                            <div className="w-[100px]">{card.type}</div>
                            <div className="w-[150px]">{String(new Date(card.createdAt).toDateString())}</div>
                            <div onClick={(e) => e.stopPropagation()} className="w-[180px] flex items-center justify-center gap-6">
                                <div
                                    className="cursor-pointer bg-gray-50 rounded-full p-3 hover:opacity-75"
                                    onClick={() => navigate(`/dashboard/${card.type}/create/${card._id}`)}
                                >
                                    <LuPencilLine size={18} className="" />
                                </div>
                                <div
                                    className="cursor-pointer bg-gray-50 rounded-full p-3 hover:opacity-75"
                                    onClick={() => {
                                        setOpen(true)
                                        setCurrentIndex(cards.indexOf(card as any))
                                    }}
                                >
                                    <FiEye size={18} className="" />
                                </div>
                                <div
                                    className="cursor-pointer bg-gray-50 rounded-full p-3 hover:opacity-75"
                                    onClick={() => {
                                        setOpenDelete(true)
                                        setCurrentIndex(cards.indexOf(card as any))
                                    }}
                                >
                                    <RiDeleteBin6Line size={18} className="text-red-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="mt-12 flex flex-col justify-center items-center space-y-4">
                        <img src={NoQR} alt="no qr" className="h-28 w-28" />
                        <p className="text-[#7D7D7D] font-semibold text-lg">No existing QR codes</p>
                    </div>
                )}

                {!loading && cards && cards.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-t">
                        <div>
                            <p>current page - {counts.currentPage}</p>
                        </div>
                        <div className="flex justify-center items-center gap-3">
                            <button
                                onClick={() => setCounts(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                                disabled={counts.currentPage === 1}
                            >
                                prev
                            </button>
                            <p>
                                {counts.currentPage} / {Math.ceil(counts.filteredCards / counts.resultPerPage)}
                            </p>
                            <button
                                onClick={() => setCounts(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                                disabled={counts.currentPage === Math.ceil(counts.filteredCards / counts.resultPerPage)}
                            >
                                next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="lg:hidden block">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader2 className="text-center animate-spin" />
                    </div>
                ) : cards && cards.length > 0 ? (type === "ALL" ? cards : cards.filter(card => card.type === type)).map(card => (
                    <div
                        key={card._id}
                        onClick={() => navigate(`/dashboard/cards/card/${card.type}/${card._id}`)}
                        className="border flex items-center gap-3 p-3 rounded-lg mx-4 sm:mx-16 mt-5"
                        ref={cardDropdownRef}
                    >
                        <input type="checkbox" className="w-4 h-4" />
                        <div className="flex flex-col font-medium text-sm sm:text-base">
                            <div>{card.data.name}</div>
                            <div className="w-fit mt-1 text-center border border-gray-400 px-3 py-1 rounded-full">
                                {card.shortCode}
                            </div>
                        </div>
                        <button
                            className="ml-auto"
                            onClick={(e) => {
                                e.stopPropagation()
                                setActiveDropdownId(activeDropdownId === card._id ? null : card._id)
                            }}
                        >
                            <CiMenuKebab />
                        </button>
                        {activeDropdownId === card._id && (
                            <div onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                                <ul className="py-2">
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            navigate(`/dashboard/${card.type}/create/${card._id}`);
                                            // setActiveDropdownId(null);
                                        }}
                                    >
                                        Edit
                                    </li>
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            if (isMobile) {
                                                navigate(`/dashboard/card?type=${card.type}`);
                                            } else {
                                                setOpen(true)
                                                setCurrentIndex(cards.indexOf(card as any));
                                            }
                                            // setActiveDropdownId(null);
                                        }}
                                    >
                                        View
                                    </li>
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setOpenDelete(true);
                                            setCurrentIndex(cards.indexOf(card as any));
                                            setActiveDropdownId(null);
                                        }}
                                    >
                                        Delete
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="mt-12 flex flex-col justify-center items-center space-y-4">
                        <img src={NoQR} alt="no qr" className="h-24 w-24" />
                        <p className="text-[#7D7D7D] font-semibold text-lg">No existing QR codes</p>
                    </div>
                )}

                {!loading && cards && cards.length > 0 && (
                    <div className="mt-6 flex justify-center items-center gap-3">
                        <button
                            onClick={() => setCounts(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                            disabled={counts.currentPage === 1}
                        >
                            prev
                        </button>
                        <p>
                            {counts.currentPage} / {Math.ceil(counts.filteredCards / counts.resultPerPage)}
                        </p>
                        <button
                            onClick={() => setCounts(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                            disabled={counts.currentPage === Math.ceil(counts.filteredCards / counts.resultPerPage)}
                        >
                            next
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard;