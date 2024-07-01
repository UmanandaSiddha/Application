import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SingleCreatorResponse } from "@/types/api-types";
import axios from "axios";

const inputs = [
    { name: "", label: "Instagram", text : "Enter Your Instagram Profile" },
    { name: "", label: "Youtube", text : "Enter Your Youtube Profile" },
    { name: "", label: "Spotify", text : "Enter Your Spotify Profile" },
    { name: "", label: "Discord", text : "Enter Your Discord Profile" },
    { name: "", label: "X", text : "Enter Your X Profile" },
]

const CreatorInput = () => {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("creatorId");
    const [name, setName] = useState("");
    const [otherLink, setOtherLink] = useState("");
    const [otherName, setOtherName] = useState("");
    const [open, setOpen] = useState<boolean>(false);
    const [arrData, setArrData] = useState<any | null>(inputs);
    const [creatorLoading, setCreatorLoading] = useState<boolean>(false);
    const [isCreator, setIsCreator] = useState<boolean>(id ? true : false);

    const { user, isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );
    
    useEffect(() => {
        const fetchCreator = async () => {
            if (id) {
                try {
                    const { data }: { data: SingleCreatorResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/detailed/${id}?type=creator`, { withCredentials: true });
                    setIsCreator(true);
                    setName(data.vCard.name);
                    setArrData(data.vCard.links);
                } catch (error: any) {
                    toast.error(error.response.data.message);
                }
            }
        };

        const cardData = localStorage.getItem("current_card");
        if (cardData && id) {
            const cardDataParsed = JSON.parse(cardData);
            if (cardDataParsed?._id !== id) {
                fetchCreator();
            } else {
                setIsCreator(true);
                setName(cardDataParsed.name);
                setArrData(cardDataParsed.links);
            }
        } else {
            fetchCreator();
        }
    }, [id]);

    const handleAdd = () => {
        setArrData([
            ...arrData,
            {
                name: otherLink,
                label: otherName,
                text: `Enter Your ${otherName} Profile`,
            },
        ]);
        setOpen(false);
        setOtherLink("");
        setOtherName("");
    };

    const handleChange = (event: any, index: number) => {
        setArrData((prevData: any) => [
            ...prevData.slice(0, index),
            {
                ...prevData[index],
                [event.target.name]: event.target.value,
            },
            ...prevData.slice(index + 1),
        ]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCreatorLoading(true);
        let final = [];
        for (let i = 0; i < arrData.length; i++) {
            const element = {
                label: arrData[i].label,
                name: arrData[i].name,
            };
            if (element.name) {
                final.push(element);
            }
        }
        const creatorData = {
            name,
            links: final,
            user: user?._id,
        };

        if (!isPaid && user?.role !== "admin") {
            navigate("/plans");
        } else {
            try {
                if (isCreator) {
                    await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=creator`, creatorData, { withCredentials: true });
                    toast.success("Creator VCard Updated");
                } else {
                    await axios.post(
                        `${import.meta.env.VITE_BASE_URL}/cards/new?type=creator`, creatorData, { withCredentials: true }
                    );
                    toast.success("Creator VCard Created");
                }
                navigate(-1);
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        }
        setCreatorLoading(false);
    };

    function handleCloseForm(e: React.MouseEvent<HTMLInputElement>) {
        if ((e.target as Element).id === "popupform") {
            setOpen(false);
        }
    }

    const action = id && isCreator ? "Update" : "Create";
    const displayText = creatorLoading ? action.slice(0, -1) + "ing..." : action;

    return (
        <>
            <div className="w-full lg:flex lg:justify-center">
                <h1 className="pl-6 font-Philosopher text-4xl font-bold lg:mt-[2rem]">Creator</h1>
            </div>
            <div className="flex flex-col justify-center items-center my-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2 flex flex-row items-center">
                        <div className="basis-1/3 flex justify-start pr-4 font-Kanit text-xl pt-2">
                            <label htmlFor="name" className="">
                                Name:
                            </label>
                        </div>
                        <div className="basis-2/3 ">
                            <input
                                className="block py-2.5 px-0 w-full text-lg font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                type="text"
                                id="name"
                                value={name}
                                placeholder="Enter your name"
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 font-Kanit">
                        <div className="lg:flex lg:justify-center"><h1 className="font-semibold text-lg font-Philosopher underline">Social Media Profiles</h1></div>
                        {arrData && (
                            <div className="flex flex-col space-y-2">
                                {arrData.map((arr: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex w-full justify-center items-center gap-2"
                                    >
                                        <div className="basis-1/3 flex justify-start">
                                            <label htmlFor={`name-${index}`}>{arr.label}:</label>
                                        </div>
                                        <div className="basis-2/3">
                                            <input
                                                className="block py-2.5 px-0 w-full text-sm font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                                type="text"
                                                id={`name-${index}`}
                                                name="name"
                                                value={arr.name}
                                                onChange={(e) => handleChange(e, index)}
                                                placeholder={arr.text}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-6 pt-10">
                        <div className="">
                            <button
                                className="w-[350px] bg-black text-white font-bold py-2 px-4 rounded"
                                type="button"
                                onClick={() => setOpen(true)}
                            >
                                Add more
                            </button>
                            {open && (
                                <div className="font-Kanit">
                                    <div
                                        className="fixed inset-0 bg-opacity-30 backdrop-blur lg flex justify-center items-center z-10"
                                        id="popupform"
                                        onClick={handleCloseForm}
                                    >
                                        <div className="bg-white p-8 rounded shadow-lg w-[425px]">
                                            <h2 className="text-lg font-bold mb-4 flex justify-center underline">
                                                Add Another Social Profile
                                            </h2>
                                            <div className="grid gap-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <label
                                                        htmlFor="name"
                                                        className="text-right text-lg font-semibold"
                                                    >
                                                        Name
                                                    </label>
                                                    <input
                                                        className="col-span-3 border rounded px-4 py-2 text-sm"
                                                        type="text"
                                                        id="name"
                                                        value={otherName}
                                                        onChange={(e) => setOtherName(e.target.value)}
                                                        placeholder="Enter Social Media Platform"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <label
                                                        htmlFor="link"
                                                        className="text-right text-lg font-semibold"
                                                    >
                                                        Link
                                                    </label>
                                                    <input
                                                        className="col-span-3 border rounded px-4 py-2 text-sm"
                                                        type="text"
                                                        id="link"
                                                        value={otherLink}
                                                        onChange={(e) => setOtherLink(e.target.value)}
                                                        placeholder="Enter Social Media Link"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <button
                                                    className="bg-black text-white font-bold py-2 px-4 rounded"
                                                    type="button"
                                                    onClick={handleAdd}
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded ml-2"
                                                    type="button"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                        <div className="">
                            <button
                                className="w-[350px] bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                type="submit"
                                disabled={creatorLoading}
                            >
                                {displayText}
                            </button>
                        </div>
                </form>
            </div>
        </>
    );
};

export default CreatorInput;
