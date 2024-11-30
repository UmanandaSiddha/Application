import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { SingleTreeResponse } from "@/types/api-types";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import SideBar from "@/components/rest/sidebar";

const inputs = [
    { name: "name", label: "Name", text: "Enter name", type: "text" },
    { name: "scientificName", label: "Scientific Name", text: "Enter scientific name", type: "text" },
    { name: "treeType", label: "Tree Type", text: "Enter tree type", type: "text" },
    { name: "location", label: "Location", text: "Enter location", type: "text" },
    { name: "description", label: "Description", text: "Enter description", type: "text" },
    { name: "features", label: "Features", text: "Enter features", type: "text" },
    { name: "maintenance", label: "Maintenance", text: "Enter maintenance", type: "text" },
    { name: "benefits", label: "Benefits", text: "Enter benefits", type: "text" },
    { name: "funFact", label: "Fun Fact", text: "Enter fun fact", type: "text" },
];

const generateDefaultValues = (fields: { name: string }[]) => {
    return fields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {} as Record<string, string>);
};

const CreateTree = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("botanicalId");
    const [isTree, setIsTree] = useState<boolean>(id ? true : false);
    const [treeLoading, setTreeLoading] = useState<boolean>(false);

    const { user, isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const form = useForm({
        defaultValues: generateDefaultValues(inputs),
    });

    const { handleSubmit, register, reset } = form;

    useEffect(() => {
        const fetchTree = async () => {
            if (id) {
                try {
                    const { data }: { data: SingleTreeResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/detailed/${id}?type=botanical`, { withCredentials: true });
                    setIsTree(true);
                    reset(data.vCard);
                } catch (error: any) {
                    toast.error(error.response.data.message);
                }
            }
        }

        const cardData = localStorage.getItem("current_card");
        if (cardData && id) {
            const cardDataParsed = JSON.parse(cardData);
            if (cardDataParsed?._id !== id) {
                fetchTree();
            } else {
                setIsTree(true);
                reset(cardDataParsed);
            }
        } else {
            fetchTree();
        }
    }, [id]);

    const onSubmit = async (values: any) => {
        setTreeLoading(true);

        const convertedValues = inputs.reduce((acc, input) => {
            if (input.type === "number") {
                acc[input.name] = Number(values[input.name]);
            } else {
                acc[input.name] = values[input.name];
            }
            return acc;
        }, {} as Record<string, any>);

        const treeData = {
            ...convertedValues,
            user: user?._id,
        };

        if (!isPaid && user?.cards?.total! > 10 && user?.role !== "admin") {
            navigate("/plans");
        } else {
            try {
                if (isTree) {
                    await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=botanical`, treeData, { withCredentials: true });
                    // toast.success("Tree VCard Updated");
                } else {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=botanical`, treeData, { withCredentials: true });
                    // toast.success("Tree VCard Created");
                }
                navigate(-1);
            } catch (error: any) {
                toast.error(error.response.data.message);
                navigate("/plans");
            }
        }
        setTreeLoading(false);
    }

    return (
        <div className="flex justify-center">
            <div className="flex flex-row w-[80%] md:space-x-4 lg:space-x-4">
                <div className="basis-1/4 hidden lg:block xl:block">
                    <SideBar />
                </div>
                <div className="basis-full lg:basis-3/4 lg:max-h-screen">
                    <div className="h-[85vh] overflow-y-scroll mb-4 hide-scrollbar">
                        <h1 className="font-bold text-4xl text-center mt-6 mb-16 lg:mb-12">Botanical</h1>
                        <div className="flex flex-col justify-center items-center lg:w-full">
                            <div className="flex flex-col justify-center pb-10">

                                <div className="flex justify-center lg:mt-4 mb-10 lg:flex lg:justify-center">
                                    <div className="w-full sm:h-4 h-2 bg-blue-100 rounded-full">
                                        <div
                                            className="sm:h-4 h-2 bg-blue-500 rounded-full"
                                            style={{ width: `100%` }}
                                        ></div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:w-full">
                                    {inputs.map((input, index) => (
                                        <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                            <label
                                                htmlFor={input.name}
                                                className="text-md font-semibold text-gray-700 min-w-24"
                                            >
                                                {input.label}:
                                            </label>
                                            <div className="relative h-11 w-full min-w-44">
                                                <input
                                                    type={input.type}
                                                    id={input.name}
                                                    placeholder={input.text}
                                                    {...register(input.name, { required: true })}
                                                    autoComplete="off"
                                                    className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                />
                                                <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-center">
                                        <button
                                            className="px-4 py-2 mt-4 rounded-lg hover:cursor-pointer w-full max-w-2xl text-white bg-[#3FA398] text-lg"
                                            type="submit"
                                            disabled={treeLoading}
                                        >
                                            {treeLoading ? "APPLYING..." : "APPLY CHANGES"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateTree;