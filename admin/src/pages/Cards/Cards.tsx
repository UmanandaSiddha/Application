import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { Animal, Creator, Medical, Personal, Tree } from "../../types/types";
import axios from "axios";
import { AllCardsResponse } from "../../types/api-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cards = () => {

    const navigate = useNavigate();
    const [cards, setCards] = useState<Tree[] | Personal[] | Medical[] | Creator[] | Animal[]>();
    const [type, setType] = useState<"botanical" | "individual" | "medical" | "creator" | "animal">("botanical");
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        totalCards: 1
    });

    const fetchCards = async (type: string, page: number) => {
        try {
            const { data }: { data: AllCardsResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/cards/all?page=${page}&type=${type}`, { withCredentials: true });
            setCards(data.cards);
            setCounts({
                ...counts,
                resultPerPage: data.resultPerPage,
                totalCards: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchCards(type, counts.currentPage);
    }, [type, counts.currentPage]);

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Cards
                        </h4>
                        <div className="flex items-center justify-center">
                            <select className="text-black px-3 py-2 rounded-md" value={type} onChange={(e) => setType(e.target.value as "botanical" | "individual" | "medical" | "creator" | "animal")}>
                                <option value="botanical">Botanical</option>
                                <option value="animal">Animal</option>
                                <option value="medical">Medical</option>
                                <option value="creator">Creator</option>
                                <option value="individual">Individual</option>
                            </select>
                        </div>
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage - 1 })}
                                disabled={counts.currentPage === 1}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Prev
                            </button>
                            <p className="text-md font-semibold truncate">{counts.currentPage} / {Math.ceil(counts.totalCards / counts.resultPerPage)}</p>
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
                                disabled={counts.currentPage === Math.ceil(counts.totalCards / counts.resultPerPage)}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                        <div className="col-span-2 flex items-center">
                            <p className="font-medium">Name</p>
                        </div>
                        <div className="col-span-2 hidden items-center sm:flex">
                            <p className="font-medium">Card Type</p>
                        </div>
                        <div className="col-span-2 hidden items-center sm:flex">
                            <p className="font-medium">Created</p>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <p className="font-medium">Creator</p>
                        </div>
                    </div>

                    {cards?.map((card, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/cards/details?id=${card._id}&type=${type}`)}
                        >
                            <div className="col-span-2 flex items-center">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <p className="text-sm text-black dark:text-white">
                                        {card.name}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-2 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {type.toUpperCase()}
                                </p>
                            </div>
                            <div className="col-span-2 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {String(new Date(card.createdAt).toLocaleDateString())}
                                </p>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <p
                                    className="text-sm text-meta-3 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/card-details?id=${card.user._id}`);
                                    }}
                                >
                                    {card.user?._id}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Cards;