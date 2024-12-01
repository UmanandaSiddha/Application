import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SingleCreatorResponse } from "@/types/api-types";
import axios from "axios";
import SideBar from "@/components/rest/sidebar";
import * as icons from 'simple-icons';
import { IoMdLink } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

type ArrayInput = {
    name: string;
    label: string;
    text: string;
}

const inputs = [
    { name: "", label: "Instagram", text: "Enter Your Instagram Profile" },
    { name: "", label: "Youtube", text: "Enter Your Youtube Profile" },
    { name: "", label: "Facebook", text: "Enter Your Facebook Profile" },
    { name: "", label: "Discord", text: "Enter Your Discord Profile" },
    { name: "", label: "X", text: "Enter Your X Profile" },
]

type LinkType = {
    name: string;
    label: string;
    text: string;
}

const CreatorInput = () => {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("creatorId");
    const [name, setName] = useState("");
    const [otherLink, setOtherLink] = useState("");
    const [otherName, setOtherName] = useState("");
    const [open, setOpen] = useState<boolean>(false);
    const [arrData, setArrData] = useState<ArrayInput[] | []>(inputs);
    const [creatorLoading, setCreatorLoading] = useState<boolean>(false);
    const [isCreator, setIsCreator] = useState<boolean>(id ? true : false);
    const [isEditable, setIsEditable] = useState(false);

    const { user, isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

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

    useEffect(() => {
        fetchCreator();
    }, [id]);

    const handleAdd = () => {
        if (!isEditable && Array.isArray(arrData) && arrData.find((arr: ArrayInput) => arr.label.trim().toLowerCase() === otherName.trim().toLowerCase())) {
            toast.warning("Platform already exists!");
            return;
        }
        if (isEditable) {
            const normalizedOtherName = otherName.trim().toLowerCase();
            const index = arrData.findIndex((arr: ArrayInput) => arr.label.trim().toLowerCase() === normalizedOtherName);
            if (index !== -1) {
                const updatedArr = [...arrData];
                updatedArr[index] = {
                    ...updatedArr[index],
                    // label: normalizedOtherName,
                    name: otherLink,
                    text: `Enter Your ${otherName} Profile`,
                };
                setArrData(updatedArr);
                setIsEditable(false);
            }
        } else {
            setArrData([
                ...arrData,
                {
                    name: otherLink,
                    label: otherName,
                    text: `Enter Your ${otherName} Profile`,
                },
            ]);
        }
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

        if (!isPaid && user?.cards?.total! > 10 && user?.role !== "admin") {
            navigate("/plans");
        } else {
            try {
                if (isCreator) {
                    await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=creator`, creatorData, { withCredentials: true });
                    // toast.success("Creator VCard Updated");
                } else {
                    await axios.post(
                        `${import.meta.env.VITE_BASE_URL}/cards/new?type=creator`, creatorData, { withCredentials: true }
                    );
                    // toast.success("Creator VCard Created");
                }
                navigate(-1);
            } catch (error: any) {
                toast.error(error.response.data.message);
                navigate("/plans");
            }
        }
        setCreatorLoading(false);
    };

    function handleCloseForm(e: React.MouseEvent<HTMLInputElement>) {
        if ((e.target as Element).id === "popupform") {
            setOtherName("");
            setOtherLink("");
            setOpen(false);
        }
    }

    const setSvg = (input: string) => {
        const platformKey = `si${input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()}`;
        const icon = icons[platformKey as keyof typeof icons];
        if (icon) {
            return icon.path;
        } else {
            return "";
        }
    }

    const handleDeleteSocial = (label: string) => {
        const normalizedLabel = label.trim().toLowerCase();
        const updatedArr = arrData.filter((arr: ArrayInput) => arr.label.trim().toLowerCase() != normalizedLabel);
        setArrData(updatedArr);
    }

    return (
        <div className="flex justify-center h-screen">
            <div className="flex flex-col lg:flex-row w-[90%] md:w-[85%] lg:w-[80%] space-y-6 lg:space-y-0 lg:space-x-4">
                {/* Sidebar Section */}
                <div className="basis-1/4 hidden lg:block">
                    <SideBar />
                </div>

                {/* Main Content Section */}
                <div className="flex-1 lg:basis-3/4">
                    <div className="h-full flex flex-col">
                        {/* Title */}
                        <h1 className="font-bold text-3xl md:text-4xl text-center mt-6 mb-4">
                            Creator
                        </h1>

                        {/* Progress Bar */}
                        <div className="flex justify-center w-full lg:w-[70%] mx-auto mb-4 px-4 md:px-0">
                            <div className="w-full h-2 bg-blue-100 rounded-full">
                                <div
                                    className="h-2 bg-blue-500 rounded-full"
                                    style={{ width: `100%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1">
                            <div className="flex flex-col items-center">
                                {/* Form */}
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6 w-full lg:w-[70%] px-4 md:px-0"
                                >
                                    {/* Name Field */}
                                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                        <label
                                            htmlFor="name"
                                            className="text-md font-semibold text-gray-700 md:w-auto w-full"
                                        >
                                            Name:
                                        </label>
                                        <div className="relative w-full">
                                            <input
                                                type="text"
                                                id="name"
                                                value={name}
                                                placeholder="Enter your name"
                                                onChange={(e) => setName(e.target.value)}
                                                autoComplete="off"
                                                className="peer h-10 w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0"
                                            />
                                            <span className="absolute left-0 bottom-0 h-[2px] w-full bg-transparent scale-x-0 border-gray-500 transition-transform duration-300 peer-focus:scale-x-100 peer-focus:bg-gray-900"></span>
                                        </div>
                                    </div>

                                    {/* Socials Section */}
                                    <h1 className="text-2xl font-bold">Socials</h1>
                                    {arrData?.map((arr: LinkType, index: number) => (
                                        <div
                                            className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4"
                                            key={index}
                                        >
                                            <label
                                                htmlFor={`name-${index}`}
                                                className="text-md font-semibold text-gray-700 md:w-auto w-full"
                                            >
                                                {setSvg(arr.label) === "" ? (
                                                    <IoMdLink size={25} />
                                                ) : (
                                                    <svg
                                                        className="fill-current"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d={setSvg(arr.label)}
                                                            fill="black"
                                                        />
                                                    </svg>
                                                )}
                                            </label>
                                            <div className="flex items-center space-x-4 w-full">
                                                <div className="relative w-full">
                                                    <input
                                                        type="text"
                                                        id={`name-${index}`}
                                                        name="name"
                                                        value={arr.name}
                                                        onChange={(e) => handleChange(e, index)}
                                                        placeholder={arr.text}
                                                        autoComplete="off"
                                                        className="peer h-10 w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0"
                                                    />
                                                    <span className="absolute left-0 bottom-0 h-[2px] w-full bg-transparent scale-x-0 border-gray-500 transition-transform duration-300 peer-focus:scale-x-100 peer-focus:bg-gray-900"></span>
                                                </div>
                                                {arr.name && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="p-2"
                                                            onClick={() => {
                                                                setIsEditable(true);
                                                                setOtherLink(arr.name);
                                                                setOtherName(arr.label);
                                                                setOpen(true);
                                                            }}
                                                        >
                                                            <MdEdit size={20} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="p-2 text-red-500"
                                                            onClick={() => handleDeleteSocial(arr.label)}
                                                        >
                                                            <MdDelete size={20} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add More Button */}
                                    <div className="flex justify-center">
                                        <button
                                            className="px-4 py-2 mt-4 rounded-lg w-full lg:w-[70%] text-white bg-black text-lg"
                                            type="button"
                                            onClick={() => setOpen(true)}
                                        >
                                            ADD MORE
                                        </button>
                                    </div>

                                    {open && (
                                        <div
                                            className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10"
                                            id="popupform"
                                            onClick={handleCloseForm}
                                        >
                                            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
                                                {/* Popup Form */}
                                                <h1 className="text-2xl font-bold">
                                                    {isEditable ? "Edit" : "Add"} Social Profile
                                                </h1>
                                                <div className="space-y-4">
                                                    <div className="flex flex-col space-y-2">
                                                        <label
                                                            htmlFor="platform"
                                                            className="text-md font-semibold text-gray-700"
                                                        >
                                                            Platform:
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="platform"
                                                            disabled={isEditable}
                                                            value={otherName}
                                                            onChange={(e) => setOtherName(e.target.value)}
                                                            placeholder="Enter Social Media Platform"
                                                            autoComplete="off"
                                                            className="peer h-10 w-full border-b border-blue-gray-200 bg-transparent text-sm font-normal text-blue-gray-700 outline-none transition-all focus:border-gray-900"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col space-y-2">
                                                        <label
                                                            htmlFor="link"
                                                            className="text-md font-semibold text-gray-700"
                                                        >
                                                            Link:
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="link"
                                                            value={otherLink}
                                                            onChange={(e) => setOtherLink(e.target.value)}
                                                            placeholder="Enter Social Media Link"
                                                            autoComplete="off"
                                                            className="peer h-10 w-full border-b border-blue-gray-200 bg-transparent text-sm font-normal text-blue-gray-700 outline-none transition-all focus:border-gray-900"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end mt-4">
                                                    <button
                                                        className="bg-black text-white py-2 px-4 rounded"
                                                        type="button"
                                                        onClick={handleAdd}
                                                    >
                                                        {isEditable ? "Update" : "Create"} Social
                                                    </button>
                                                    <button
                                                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded ml-2"
                                                        type="button"
                                                        onClick={() => {
                                                            if (isEditable) {
                                                                setIsEditable(false);
                                                                setOtherName("");
                                                                setOtherLink("");
                                                            }
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="flex justify-center">
                                        <button
                                            className="px-4 py-2 mt-4 rounded-lg w-full lg:w-[70%] text-white bg-[#5674DC] text-lg"
                                            type="submit"
                                            disabled={creatorLoading}
                                        >
                                            {creatorLoading ? "APPLYING..." : "APPLY CHANGES"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorInput;