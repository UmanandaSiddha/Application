import { useEffect, useRef, useState } from "react";
import { CiMenuKebab, CiSearch } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/card_types";
import { AnimalResponse, CreatorResponse, MedicalResponse, PersonalResponse, TreeResponse } from "@/types/api-types";
import axios from "axios";
import { toast } from "react-toastify";
import QRCode from "@/components/cards/qr-code";
import CardQR from "@/components/cards/card-qr";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { useMediaQuery } from "react-responsive";
import { FiDownload, FiEye, FiPlus } from "react-icons/fi";
import { BsSliders } from "react-icons/bs";
import useCardTraversal from "@/hooks/useCardTraversal";
import { LuPencilLine } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { IoShareSocialOutline } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import { NoQR } from "@/constants/cards/actions";

const categories = [
    {
        id: 1,
        name: 'Botany',
        type: "botanical"
    },
    {
        id: 2,
        name: 'Animal',
        type: "animal"
    },
    {
        id: 3,
        name: 'Creator',
        type: "creator"
    },
    {
        id: 4,
        name: 'Medical',
        type: "medical"
    },
    {
        id: 5,
        name: 'Individual',
        type: "individual"
    }
]

export type CardType =
    | TreeResponse
    | PersonalResponse
    | MedicalResponse
    | CreatorResponse
    | AnimalResponse;

type CardCategory = "individual" | "botanical" | "animal" | "creator" | "medical";
type ActiveTabs = "qr" | "card";

const Dashboard = () => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const paramsType = (searchParams.get("type") as CardCategory) || "individual";
    const [type, setType] = useState<CardCategory>(paramsType);
    const [open, setOpen] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState<Tree[] | Personal[] | MedicalType[] | Creator[] | Animal[] | null>(null);
    const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
    const [counts, setCounts] = useState({
        currentPage: Number(searchParams.get("currentPage")) || 1,
        resultPerPage: 20,
        filteredCards: 1,
        totalCards: 1
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTabs>(searchParams.get("activeTab") as ActiveTabs || "qr");
    const cardRef = useRef<HTMLDivElement>(null);
    const [isMobileCardType, setIsMobileCardType] = useState(false);

    const fetchData = async (link: string) => {
        try {
            const { data }: { data: CardType } = await axios.get(link, { withCredentials: true });
            setCards(data.vCards);
            setCounts(prev => ({
                ...prev,
                resultPerPage: data.resultPerPage,
                filteredCards: data.filteredCardsCount,
                totalCards: data.count
            }));
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error fetching data");
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

        if (type && ["botanical", "individual", "medical", "creator", "animal"].includes(type)) {
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

    const { currentIndex, setCurrentIndex, handleNext, handlePrev, hasNext, hasPrev, handleShare, handleDownload } = useCardTraversal(type, cards, counts, setCounts);

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

    // const styles = type && typeStyles[type] ? typeStyles[type] : typeStyles.default;

    useEffect(() => {
        if (open || openUpload) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [open, openUpload]);

    // const handleShare = () => {
    //     const card = cards && cards[currentIndex];
    //     if (card && card?.shortCode && type) {
    //         window.navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/d/${card?.shortCode}`);
    //         toast.success("Link has been copied to clipboard");
    //     } else {
    //         toast.error("Something went wrong");
    //     }
    // }

    return (
        <div className="p-4 sm:p-6 lg:p-10">
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
                    <RiDeleteBin6Line size={24} className="cursor-pointer hover:opacity-75" />
                    <button
                        className="flex items-center justify-center bg-[#454545] text-white rounded-full sm:rounded-md p-1 md:px-3 md:py-1 text-sm font-medium hover:bg-gray-700 transition"
                        onClick={() => setIsDropdownOpen(prev => !prev)}
                    >
                        <FiPlus size={24} />
                        <span className="hidden sm:inline ml-2 text-lg">Add</span>
                    </button>
                </div>

                {isDropdownOpen && (
                    <div
                        onClick={() => setIsDropdownOpen(false)}
                        className="absolute right-2 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg"
                    >
                        <ul className="py-2">
                            <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => navigate(`/dashboard/${type}/create`)}
                            >
                                Create QR
                            </li>
                            <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setOpenUpload(true)}
                            >
                                Bulk QR
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Create Folder</li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="block md:hidden mt-2 border border-gray-500 rounded-lg py-2 px-3 mx-4 sm:mx-16">
                <div className="flex justify-between items-center">
                    {isMobileCardType ? (
                        <p className="font-normal">QR code type</p>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            <input type="checkbox" className="w-4 h-4" />
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
                                onClick={() => setType(category.type as CardCategory)}
                            >
                                <div className="border border-gray-400 rounded-md py-1 px-2 flex items-center gap-2">
                                    <input type="checkbox" className="w-4 h-4" />
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
                        <div onClick={(e) => e.stopPropagation()} className="flex justify-center items-center gap-4 text-white">
                            <button onClick={() => setActiveTab("qr")} className={activeTab === "qr" ? "underline" : ""}>
                                Qr Code
                            </button>
                            <button onClick={() => setActiveTab("card")} className={activeTab === "card" ? "underline" : ""}>
                                Card
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
                                                <QRCode card={card} type={type} />
                                            ) : (

                                                <CardQR card={card} type={type} ref={cardRef} />
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
                                onClick={handleDownload}
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
                                onClick={() => navigate(`/dashboard/${type}/create/${cards && cards[currentIndex]._id}`)}
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
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" />
                            </label>
                        </div>
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
                ) : cards && cards.length > 0 ? cards.map(card => (
                    <div
                        key={card._id}
                        onClick={() => navigate(`/dashboard/cards/card/${type}/${card._id}`)}
                        className="flex items-center justify-between px-4 py-3 cursor-pointer border-t"
                    >
                        <div className="flex items-center gap-3 w-[450px]">
                            <input type="checkbox" className="w-4 h-4" />
                            <div className="">{card.name}</div>
                        </div>
                        <div className="hidden md:flex w-full justify-between text-sm">
                            <div className="w-[100px]">{card.shortCode}</div>
                            <div className="w-[100px]">{type.toUpperCase()}</div>
                            <div className="w-[150px]">{String(new Date(card.createdAt).toDateString())}</div>
                            <div onClick={(e) => e.stopPropagation()} className="w-[180px] flex items-center justify-center gap-6">
                                <div
                                    className="cursor-pointer bg-gray-50 rounded-full p-3 hover:opacity-75"
                                    onClick={() => navigate(`/dashboard/${type}/create/${card._id}`)}
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
                                <div className="cursor-pointer bg-gray-50 rounded-full p-3 hover:opacity-75">
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
                ) : cards && cards.length > 0 ? cards.map(card => (
                    <div
                        key={card._id}
                        onClick={() => navigate(`/dashboard/cards/card/${type}/${card._id}`)}
                        className="border flex items-center gap-3 p-3 rounded-lg mx-4 sm:mx-16 mt-5"
                    >
                        <input type="checkbox" className="w-4 h-4" />
                        <div className="flex flex-col font-medium text-sm sm:text-base">
                            <div>{card.name}</div>
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
                            // onClick={() => setActiveDropdownId(activeDropdownId === card._id ? null : card._id)}
                        >
                            <CiMenuKebab />
                        </button>
                        {activeDropdownId === card._id && (
                            <div onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                                <ul className="py-2">
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => navigate(`/dashboard/${type}/create/${card._id}`)}
                                    >
                                        Edit
                                    </li>
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            if (isMobile) {
                                                navigate(`/dashboard/card?type=${type}`)
                                            } else {
                                                setOpen(true)
                                                setCurrentIndex(cards.indexOf(card as any))
                                            }
                                        }}
                                    >
                                        View
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
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