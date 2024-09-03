import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { Animal, Creator, Medical, Personal, Tree } from "../../types/types";
import axios from "axios";
import { AllCardsResponse } from "../../types/api-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cards = () => {

    const navigate = useNavigate();
    const [treeCards, setTreeCards] = useState<Tree[] | Personal[] | Medical[] | Creator[] | Animal[]>();
    const [personalCards, setPersonalCards] = useState<Tree[] | Personal[] | Medical[] | Creator[] | Animal[]>();
    const [medicalCards, setMedicalCards] = useState<Tree[] | Personal[] | Medical[] | Creator[] | Animal[]>();
    const [creatorCards, setCreatorCards] = useState<Tree[] | Personal[] | Medical[] | Creator[] | Animal[]>();
    const [animalCards, setAnimalCards] = useState<Tree[] | Personal[] | Medical[] | Creator[] | Animal[]>();

    const fetchCards = async (type: string) => {
        try {
            const { data }: { data: AllCardsResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/cards/all?type=${type}`, { withCredentials: true });
            setTreeCards(data.cards);
            switch (type) {
                case 'botanical':
                    setTreeCards(data.cards);
                    break;
                case 'individual':
                    setPersonalCards(data.cards);
                    break;
                case 'medical':
                    setMedicalCards(data.cards);
                    break;
                case 'creator':
                    setCreatorCards(data.cards);
                    break;
                case 'animal':
                    setAnimalCards(data.cards);
                    break;
                default:
                    setTreeCards(data.cards);
                    break;
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchCards("botanical");
        fetchCards("individual");
        fetchCards("medical");
        fetchCards("creator");
        fetchCards("animal");
    }, []);

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Botanical Cards
                        </h4>
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

                    {treeCards?.map((card, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/card-details?id=${card._id}&type=${card.type}`)}
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
                                    BOTANICAL
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
                                    {card.user._id}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Individual Cards
                        </h4>
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

                    {personalCards?.map((card, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/card-details?id=${card._id}&type=${card.type}`)}
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
                                    INDIVIDUAL
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
                                    {card.user._id}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Medical Cards
                        </h4>
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

                    {medicalCards?.map((card, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/card-details?id=${card._id}&type=${card.type}`)}
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
                                    MEDICAL
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
                                    {card.user._id}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Creator Cards
                        </h4>
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

                    {creatorCards?.map((card, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/card-details?id=${card._id}&type=${card.type}`)}
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
                                    CREATOR
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
                                    {card.user._id}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Animal Cards
                        </h4>
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

                    {animalCards?.map((card, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/card-details?id=${card._id}&type=${card.type}`)}
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
                                    ANIMAL
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