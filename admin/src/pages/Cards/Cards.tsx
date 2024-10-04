import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { Animal, Creator, Medical, Personal, Tree } from "../../types/types";
import axios from "axios";
import { AllCardsResponse } from "../../types/api-types";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

type TypeOptions = "botanical" | "individual" | "medical" | "creator" | "animal";

const validTypes: TypeOptions[] = ["botanical", "individual", "medical", "creator", "animal"];

const Cards = () => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const typeParams = searchParams.get('type');
    const [cards, setCards] = useState<Tree[] | Personal[] | Medical[] | Creator[] | Animal[]>();
    const [type, setType] = useState<TypeOptions>(
        validTypes.includes(typeParams as TypeOptions) ? (typeParams as TypeOptions) : "botanical"
    );
    // const [type, setType] = useState<"botanical" | "individual" | "medical" | "creator" | "animal">((typeParams as "botanical" | "individual" | "medical" | "creator" | "animal") || "botanical");
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        totalCards: 1
    });
    const [loading, setLoading] = useState(false);

    const fetchCards = async (url: string) => {
        try {
            const { data }: { data: AllCardsResponse } = await axios.get(url, { withCredentials: true });
            setCards(data.cards);
            setCounts({
                ...counts,
                resultPerPage: data.resultPerPage,
                totalCards: data.count
            });
            const payload = {
                type,
                data: data.cards,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('cards_all', JSON.stringify(payload));
        } catch (error: any) {
            toast.error(error.response.data.message);
            setCards([]);
        }
    }

    useEffect(() => {

        const queryParams = [
            `page=${counts.currentPage}`,
            type && `type=${type}`,
        ].filter(Boolean).join("&");

        setLoading(true);

        const delayDebounce = setTimeout(() => {

            const cachedLogs = window.sessionStorage.getItem('cards_all');
            if (cachedLogs) {
                const { data, expires, type: cachedType } = JSON.parse(cachedLogs);

                if (Date.now() < expires && cachedType === type) {
                    setCards(data);
                    setCounts({
                        ...counts,
                        totalCards: data.length
                    });
                    setLoading(false);
                    return;
                }
            }

            window.sessionStorage.removeItem('cards_all');
            const link = `${import.meta.env.VITE_BASE_URL}/admin/cards/all?${queryParams}`;
            fetchCards(link);
            setLoading(false);
        }, 1000);


        return () => clearTimeout(delayDebounce);

    }, [type, counts.currentPage]);

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Cards ( {counts.totalCards} )
                        </h4>
                        <div className="flex items-center justify-center">
                            <select
                                className="text-black px-3 py-2 rounded-md"
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value as "botanical" | "individual" | "medical" | "creator" | "animal");
                                    setSearchParams({ type: e.target.value as "botanical" | "individual" | "medical" | "creator" | "animal" }, { replace: true });
                                }}
                            >
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

                    {loading ? (
                        <div className="flex justify-center items-center border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
                            <div className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}></div>
                        </div>
                    ) : (cards?.length || [].length) > 0 ? (
                        <>
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
                                                navigate(`/users/details?id=${card.user._id}`);
                                            }}
                                        >
                                            {card.user?._id}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                            <p className='text-xl font-semibold capitalize'>No {type} card here</p>
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout >
    )
}

export default Cards;