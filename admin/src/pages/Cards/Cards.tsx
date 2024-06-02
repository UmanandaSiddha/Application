import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { Tree } from "../../types/types";
import axios from "axios";
import { AllTreesResponse } from "../../types/api-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cards = () => {

    const navigate = useNavigate();
    const [cards, setCards] = useState<Tree[]>();

    const gotCards = async () => {
        try {
            const { data }: { data: AllTreesResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/cards/tree`, { withCredentials: true });
            setCards(data.trees);
            console.log(data.trees);
            const localCards = {
                created: Date.now() + 30 * 1000,
                data: data.trees,
            }
            window.localStorage.setItem("all_trees", JSON.stringify(localCards));
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const userData = window.localStorage.getItem("all_trees");
        if (userData) {
            if (JSON.parse(userData)?.created < Date.now()) {
                window.localStorage.removeItem("all_trees");
                gotCards();
            } else {
                setCards(JSON.parse(userData).data);
            }
        } else {
            gotCards();
        }
    }, []);

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Tree Cards
                        </h4>
                    </div>

                    <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                        <div className="col-span-2 flex items-center">
                            <p className="font-medium">Name</p>
                        </div>
                        <div className="col-span-3 hidden items-center sm:flex">
                            <p className="font-medium">Scientific Name</p>
                        </div>
                        <div className="col-span-3 flex items-center">
                            <p className="font-medium">Creator</p>
                        </div>
                    </div>

                    {cards?.map((card, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/card-details?id=${card._id}`)}
                        >
                            <div className="col-span-2 flex items-center">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <p className="text-sm text-black dark:text-white">
                                        {card.name}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-3 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {card.scientificName}
                                </p>
                            </div>
                            <div className="col-span-3 flex items-center">
                                <p
                                    className="text-sm text-meta-3 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/user-details?id=${card.user._id}`);
                                    }}
                                >
                                    {card.user._id}
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