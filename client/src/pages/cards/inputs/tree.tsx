import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { SingleTreeResponse } from "@/types/api-types";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

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
    // { name: "phoneNumber", label: "Phone Number", text: "Enter phone number", type: "tel" },
    // { name: "age", label: "Age", text: "Enter age", type: "number" },
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
    const id = search.get("treeId");
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
                    const { data }: { data: SingleTreeResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/detailed/${id}?type=tree`, { withCredentials: true });
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

        if (!isPaid && user?.role !== "admin") {
            navigate("/plans");
        } else {
            try {
                if (isTree) {
                    await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=tree`, treeData, { withCredentials: true });
                    toast.success("Tree VCard Updated");
                } else {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=tree`, treeData, { withCredentials: true });
                    toast.success("Tree VCard Created");
                }
                navigate(-1);
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        }
        setTreeLoading(false);
    }

    return (
        <>
        <div className="lg:bg-red-400">
            <div className="my-2 lg:flex lg:justify-center lg:mt-4 lg:mb-[4rem]">
                <h1 className="font-Philosopher underline font-bold text-3xl pl-8">Tree Card</h1>
            </div>
            <div className="flex flex-col justify-center items-center min-h-screen mb-8 -mt-8 lg:w-full">
                <div className="flex flex-col justify-center max-h-screen pb-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 lg:w-full">
                        {inputs.map((input, index) => (
                            <div className="flex flex-row gap-6" key={index}>
                                <div className="basis-1/3 flex justify-start items-center">
                                    <label
                                        htmlFor={input.name}
                                        className="flex justify-start items-center font-Kanit pl-3"
                                    >
                                        {input.label}
                                    </label>
                                </div>
                                <div className="basis-2/3 w-[90%] lg:w-full mr-2">
                                    <input
                                        type={input.type}
                                        id={input.name}
                                        className="block py-2.5 px-0 w-full text-sm font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                        placeholder={input.text}
                                        // required
                                        {...register(input.name, { required: true })}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center">
                            <button
                                className="px-4 py-2 lg:mt-4 rounded-lg hover:cursor-pointer w-[90%] bg-red-400 font-Kanit text-lg"
                                type="submit"
                                disabled={treeLoading}
                            >
                                {treeLoading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default CreateTree;