import {
    SingleAnimalResponse,
    SingleCreatorResponse,
    SingleMedicalResponse,
    SinglePersonalResponse,
    SingleTreeResponse,
} from "@/types/api-types";
import axios from "axios";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import Loader from "@/components/rest/loader";
import { FaDownload } from "react-icons/fa6";
import TreeComponent from "@/components/view-card/tree";
import AnimalComponent from "@/components/view-card/animal";
import CreatorComponent from "@/components/view-card/creator";
import MedicalComponent from "@/components/view-card/medical";
import PersonalComponent from "@/components/view-card/personal";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/card_types";
import SideBar from "@/components/rest/sidebar";
import { createQRCode } from "./all-cards";
import { IoShareSocialOutline } from "react-icons/io5";

const ViewCard = () => {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("id");
    const type = search.get("type");
    const [card, setCard] = useState<Tree | Personal | MedicalType | Creator | Animal | null>(null);
    const [loading, setLoading] = useState(false);
    const { isPaid, user } = useSelector((state: RootState) => state.userReducer);

    const fetchData = async (id: string, type: string) => {
        setLoading(true);
        try {
            const { data }: { data: SingleTreeResponse | SinglePersonalResponse | SingleMedicalResponse | SingleCreatorResponse | SingleAnimalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/detailed/${id}?type=${type}`, { withCredentials: true });
            setCard(data.vCard);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (type && ["botanical", "individual", "medical", "creator", "animal"].includes(type) && id) {
            fetchData(id, type);
        }
    }, [type, id]);

    const handleDownload = () => {
        if (card && card?.shortCode && type) {
            const qrCode = createQRCode(type, card?.shortCode);

            qrCode.download({
                name: card?._id,
                extension: "png"
            });
        }
    }

    const handleShare = () => {
        if (card && card?.shortCode && type) {
            window.navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/d/${card?.shortCode}`);
            toast.success("Link has been copied to clipboard");
        } else {
            toast.error("Something went wrong");
        }
    }

    const deleteCard = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=${type}`, { withCredentials: true });
            toast.success("Card Deleted");
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    const renderCard = () => {
        switch (type) {
            case "botanical":
                return <TreeComponent card={card as Tree} />;
            case "individual":
                return <PersonalComponent card={card as Personal} />;
            case "medical":
                return <MedicalComponent card={card as MedicalType} />;
            case "creator":
                return <CreatorComponent card={card as Creator} />;
            case "animal":
                return <AnimalComponent card={card as Animal} />;
            default:
                return <h1>You have enter a broken link, no cards here</h1>;
        }
    };

    return card ? (
        <div className="flex justify-center">
            <div className="flex flex-row w-full md:w-[80%] md:space-x-4 lg:space-x-4">
                <div className="basis-1/4 hidden lg:block">
                    <SideBar />
                </div>
                <div className="basis-full lg:basis-3/4 flex lg:max-h-[87vh] md:my-2 rounded-md">
                    <div className="basis-full lg:basis-3/4 flex justify-center items-center">
                        <div className="w-full overflow-auto h-full md:rounded-xl md:mr-5 hide-scrollbar">
                            {loading ? <Loader /> : <>{renderCard()}</>}
                            <div className="w-full py-4 fixed bottom-0 flex md:hidden justify-center rounded-t-3xl items-center gap-6 bg-slate-100">
                                <button
                                    className="py-4 px-4 bg-green-200 rounded-full hover:cursor-pointer shadow-xl"
                                    disabled={!isPaid && user?.role !== "admin"}
                                    onClick={handleDownload}
                                >
                                    <div className="flex">
                                        <div className="flex justify-center">
                                            <FaDownload className="w-[1.5rem] h-[1.5rem]" />
                                        </div>
                                    </div>
                                </button>
                                <button
                                    className="py-4 px-4 bg-blue-200 rounded-full hover:cursor-pointer shadow-xl"
                                    disabled={!isPaid && user?.role !== "admin"}
                                    onClick={handleShare}
                                >
                                    <div className="flex">
                                        <div className="flex justify-center">
                                            <IoShareSocialOutline className="w-[1.5rem] h-[1.5rem]" />
                                        </div>
                                    </div>
                                </button>
                                <button
                                    className="py-4 px-4 bg-slate-300 rounded-full hover:cursor-pointer shadow-xl"
                                    disabled={!isPaid && user?.role !== "admin"}
                                    onClick={() => navigate(`/dashboard/${type}/create?${type}Id=${card?._id}`)}
                                >
                                    <div className="flex justify-center">
                                        <div className="">
                                            <MdEdit className="w-[1.5rem] h-[1.5rem] text-black" />
                                        </div>
                                    </div>
                                </button>
                                <button
                                    className=" bg-red-300 px-4 py-4 rounded-full hover:cursor-pointer shadow-xl"
                                    disabled={!isPaid && user?.role !== "admin"}
                                    onClick={() => deleteCard()}
                                >
                                    <div className="flex justify-center">
                                        <div className="">
                                            <MdDelete className="w-[1.5rem] h-[1.5rem] text-black" />
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="basis-1/4 hidden md:block">
                        <div className="mt-6 md:mt-0 pt-8 pb-16 flex flex-col justify-center items-center gap-6 bg-slate-100 rounded-b-3xl">
                            <button
                                className="py-4 px-4 bg-green-200 rounded-full hover:cursor-pointer shadow-xl"
                                disabled={!isPaid && user?.role !== "admin"}
                                onClick={handleDownload}
                            >
                                <div className="flex">
                                    <div className="flex justify-center">
                                        <FaDownload className="w-[1.5rem] h-[1.5rem]" />
                                    </div>
                                </div>
                            </button>
                            <button
                                className="py-4 px-4 bg-blue-200 rounded-full hover:cursor-pointer shadow-xl"
                                disabled={!isPaid && user?.role !== "admin"}
                                onClick={handleShare}
                            >
                                <div className="flex">
                                    <div className="flex justify-center">
                                        <IoShareSocialOutline className="w-[1.5rem] h-[1.5rem]" />
                                    </div>
                                </div>
                            </button>
                            <button
                                className="py-4 px-4 bg-slate-300 rounded-full hover:cursor-pointer shadow-xl"
                                disabled={!isPaid && user?.role !== "admin"}
                                onClick={() => navigate(`/dashboard/${type}/create?${type}Id=${card?._id}`)}
                            >
                                <div className="flex justify-center">
                                    <div className="">
                                        <MdEdit className="w-[1.5rem] h-[1.5rem] text-black" />
                                    </div>
                                </div>
                            </button>
                            <button
                                className=" bg-red-300 px-4 py-4 rounded-full hover:cursor-pointer shadow-xl"
                                disabled={!isPaid && user?.role !== "admin"}
                                onClick={() => deleteCard()}
                            >
                                <div className="flex justify-center">
                                    <div className="">
                                        <MdDelete className="w-[1.5rem] h-[1.5rem] text-black" />
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex justify-center items-center h-screen">
            <p className="text-2xl font-semibold text-red-500">Error</p>
        </div>
    );
};

export default ViewCard;