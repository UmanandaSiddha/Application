import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { inputs } from "@/types/form-inputs";
import { RootState } from "../../../redux/store";
import { SingleTreeResponse } from "@/types/api-types";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { treeNotTemp } from "@/redux/reducer/treeReducer";
import { Tree } from "@/types/types";

const CreateTree = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("treeId");
    const dispatch = useDispatch();

    const [card, setCard] = useState<Tree | null>();
    const [isTree, setIsTree] = useState<boolean>(id ? true : false);
    const [treeLoading, setTreeLoading] = useState<boolean>(false);

    const { user, isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    useEffect(() => {
        const fetchTree = async () => {
            if (id) {
                try {
                    const { data }: { data: SingleTreeResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/detailed/${id!}?type=tree`, { withCredentials: true });
                    setIsTree(true);
                    setCard(data.vCard);
                } catch (error: any) {
                    toast.error(error.response.data.message);
                    dispatch(treeNotTemp());
                }
            }
        }
        const cardData = localStorage.getItem("current_card");
        if (cardData) {
            const { name, scientificName, treeType, location, description, features, maintenance, benefits, funFact } = JSON.parse(cardData);
            form.setValue("name", name);
            form.setValue("scientificName", scientificName);
            form.setValue("treeType", treeType);
            form.setValue("location", location);
            form.setValue("description", description);
            form.setValue("features", features);
            form.setValue("maintenance", maintenance);
            form.setValue("benefits", benefits);
            form.setValue("funFact", funFact);
            if (card?._id !== id) {
                fetchTree();
            }
        } else {
            fetchTree();
        }
    }, [card]);

    const form = useForm({
        defaultValues: {
            name: "",
            scientificName: "",
            treeType: "",
            location: "",
            description: "",
            features: "",
            maintenance: "",
            benefits: "",
            funFact: "",
        },
    });

    const { handleSubmit, register } = form;

    const onSubmit = async (values: any) => {
        setTreeLoading(true);
        const treeData = {
            name: values.name,
            scientificName: values.scientificName,
            treeType: values.treeType,
            location: values.location,
            description: values.description,
            features: values.features,
            maintenance: values.maintenance,
            benefits: values.benefits,
            funFact: values.funFact,
            user: user?._id
        }
        try {
            if (isTree) {
                await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=tree`, treeData, { withCredentials: true });
                toast.success("Tree VCard Updated");
            } else {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=tree`, treeData, { withCredentials: true });
                toast.success("Tree VCard Created");
            }
            if (isPaid || user?.role === "admin") {
                navigate(-1);
            } else {
                navigate("/plans");
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            if (!isPaid && user?.role !== "admin") {
                navigate("/plans");
            }
        }
        console.log(treeData);
        setTreeLoading(false);
    }

    return (
        <>
            <div className="my-2">
                <h1 className="font-Kanit font-bold text-3xl pl-8">Tree</h1>
            </div>
            <div className="flex flex-col justify-center items-center min-h-screen mb-8 -mt-8">
                <p>{card?.name!}</p>
                <div className="flex flex-col justify-center max-h-screen pb-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {inputs.map((input, index) => (
                            <div className="flex flex-row gap-6" key={index}>
                                <div className="basis-1/3 flex justify-start items-center">
                                    <label
                                        htmlFor=""
                                        className="flex justify-start items-center font-Kanit pl-3"
                                    >
                                        {input.label}
                                    </label>
                                </div>
                                <div className="basis-2/3 w-[90%] mr-2">
                                    <input
                                        type="text"
                                        id="floating_email"
                                        className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                        placeholder={input.text}
                                        required
                                        {...register(input.name, { required: true })}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center">
                            <button
                                className="px-4 py-2 rounded-md hover:cursor-pointer w-[90%] bg-red-400 font-Kanit text-lg"
                                type="submit"
                                disabled={treeLoading}
                            >
                                {treeLoading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateTree;