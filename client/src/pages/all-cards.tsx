import axios from "axios";
import { 
    AnimalResponse, 
    CreatorResponse, 
    MedicalResponse, 
    PersonalResponse, 
    TreeResponse 
} from "@/types/api-types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import QrCode from "qrcode";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import Loader from "@/components/rest/loader";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaginationDemo } from "@/components/rest/pagination-demo";
import { Animal, Creator, MedicalType, Personal, Tree, User } from "../types/types";

interface PropsType {
    card: Tree | Personal | MedicalType | Creator | Animal | null;
    user: User;
    isPaid: boolean;
    type: String;
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
        <Card onClick={() => navigate(`/dashboard/cards/card?id=${card?._id}&type=${type}`)} className="w-[300px] flex flex-col justify-center items-center">
            <CardHeader className="text-center">
                {(type === "tree") && (
                    <>
                        {('scientificName' in card!) && (
                            <>
                                <CardTitle>{card?.name}</CardTitle>
                                <CardDescription>{card?.scientificName}</CardDescription>
                            </>
                        )}
                    </>
                )}
                {(type === "personal") && (
                    <>
                        {('aboutMe' in card!) && (
                            <>
                                <CardTitle>{card?.name}</CardTitle>
                                <CardDescription>{card?.aboutMe.aboutme}</CardDescription>
                            </>
                        )}
                    </>
                )}
                {(type === "medical") && (
                    <>
                        {('personalInfo' in card!) && (
                            <>
                                <CardTitle>{card?.personalInfo.name}</CardTitle>
                                <CardDescription>{card?.personalInfo.gender}</CardDescription>
                            </>
                        )}
                    </>
                )}
                {(type === "creator") && (
                    <>
                        {('name' in card!) && (
                            <>
                                <CardTitle>{card?.name}</CardTitle>
                            </>
                        )}
                    </>
                )}
                {(type === "animal") && (
                    <>
                        {('gender' in card!) && (
                            <>
                                <CardTitle>{card?.species}</CardTitle>
                                <CardDescription>{card?.gender}</CardDescription>
                            </>
                        )}
                    </>
                )}
            </CardHeader>
            <CardContent>
                {(isPaid || user.role === "admin") ? (
                    <img src={qr} alt={card?._id} />
                ) : (
                    <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
                )}
            </CardContent>
        </Card>
    );
};

const AllCards = () => {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const type = search.get("type");

    const { isPaid, user } = useSelector(
        (state: RootState) => state.userReducer
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [cards, setCards] = useState<any[]>([]);
    const [countData, setCountData] = useState(1);
    const [loading, setLoading] = useState(false);

    const headSetter = (headType: String) => {
        if (["tree", "personal", "medical", "creator", "animal"].includes(type!)) {
            return headType.charAt(0).toUpperCase() + headType.slice(1).toLowerCase();
        } else {
            return;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (["tree", "personal", "medical", "creator", "animal"].includes(type!)) {
                try {
                    const { data }: { data: TreeResponse | PersonalResponse | MedicalResponse | CreatorResponse | AnimalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/user?page=${currentPage}&type=${type}`, { withCredentials: true });
                    setCards(data.vCards);
                    setCountData(data.count);
                } catch (error: any) {
                    toast.error(error.response.data.message);
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [currentPage]);

    const setCurrentPageNo = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const setLink = (type: String) => {
        switch (type) {
            case "tree":
                return `/dashboard/tree/create`
            case "personal":
                return `/dashboard/personal/create`;
            case "medical":
                return `/dashboard/medical/create`;
            case "creator":
                return `/dashboard/creator/create`;
            case "animal":
                return `/dashboard/animal/create`;
            default:
                return `/dashboard/tree/create`;
        }
    }

    return (
        <div className='flex flex-col justify-center gap-4 items-center mt-8'>
            {["tree", "personal", "medical", "creator", "animal"].includes(type!) ? (
                <>
                    <Button onClick={() => navigate(setLink(type!))}>Create New {headSetter(type!)} Card</Button>
                    {(!isPaid && user?.role !== "admin") && <p>You are not Subscribed</p>}
                    <h1 className="text-3xl">Your {headSetter(type!)} Cards</h1>
                    <div className="flex flex-wrap p-4 gap-4 justify-center">
                        {loading ? <Loader /> : (
                            cards.map((card) => (
                                <VCard key={card._id} type={type!} card={card} isPaid={isPaid} user={user!} />
                            ))
                        )}
                    </div>
                    {countData > 0 && (
                        <div>
                            <PaginationDemo currentPage={currentPage} total={Math.ceil(countData / 5)} setPage={setCurrentPageNo} />
                        </div>
                    )}
                </>
            ) : (
                <h1>You have enter a broken link, no cards here</h1>
            )}
        </div>
    );
};

export default AllCards;