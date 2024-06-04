import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from 'react-toastify';
import { SingleAnimalResponse } from "@/types/api-types";
import axios from "axios";
import { useEffect, useState } from "react";

const inputs = [
    { name: "species", label: "Species", text: "Enter Species", type: "text" },
    { name: "name", label: "Name", text: "Enter Animal Name", type: "text" },
    { name: "age", label: "Age", text: "Enter Animal Age", type: "number" },
    { name: "gender", label: "Gender", text: "Enter Animal Gender", type: "text" },
    { name: "color", label: "Color / Marking", text: "Enter Color / Marking", type: "text" },
    { name: "location", label: "Location", text: "Enter Animal Location", type: "text" },
    { name: "owner", label: "Owner Name", text: "Enter Owner Name", type: "text" },
    { name: "phone", label: "Phone Number", text: "Enter Phone Number", type: "tel" }
];

const generateDefaultValues = (fields: { name: string }[]) => {
    return fields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {} as Record<string, string>);
};

const convertToStrings = (data: any) => {
    return Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key] !== undefined && data[key] !== null ? String(data[key]) : "";
        return acc;
    }, {} as Record<string, string>);
};

const CreateAnimal = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("animalId");
    const [isAnimal, setIsAnimal] = useState<boolean>(id ? true : false);
    const [animalLoading, setAnimalLoading] = useState<boolean>(false);

    const { user, isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const form = useForm({
        defaultValues: generateDefaultValues(inputs),
    });

    const { handleSubmit, register, reset } = form;

    useEffect(() => {
        const fetchAnimal = async () => {
            if (id) {
                try {
                    const { data }: { data: SingleAnimalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/detailed/${id}?type=animal`, { withCredentials: true });
                    setIsAnimal(true);
                    reset(convertToStrings(data.vCard));
                } catch (error: any) {
                    toast.error(error.response.data.message);
                }
            }
        }

        const cardData = localStorage.getItem("current_card");
        if (cardData && id) {
            const cardDataParsed = JSON.parse(cardData);
            if (cardDataParsed?._id !== id) {
                fetchAnimal();
            } else {
                setIsAnimal(true);
                reset(convertToStrings(cardDataParsed));
            }
        } else {
            fetchAnimal();
        }
    }, [id, reset]);

    const onSubmit = async (values: any) => {
        setAnimalLoading(true);

        const convertedValues = inputs.reduce((acc, input) => {
            if (input.type === "number") {
                acc[input.name] = Number(values[input.name]);
            } else {
                acc[input.name] = values[input.name];
            }
            return acc;
        }, {} as Record<string, any>);

        const animalData = {
            ...convertedValues,
            user: user?._id,
        };

        if (!isPaid && user?.role !== "admin") {
            navigate("/plans");
        } else {
            try {
                if (isAnimal) {
                    await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=animal`, animalData, { withCredentials: true });
                    toast.success("Animal VCard Updated");
                } else {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=animal`, animalData, { withCredentials: true });
                    toast.success("Animal VCard Created");
                }
                navigate(-1);
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        }

        setAnimalLoading(false);
    }

    return (
        <>
            <div className="w-full">
                <div className="lg:flex lg:justify-center">
                    <h1 className="pl-6 font-Philosopher text-4xl font-bold lg:mt-[2rem] lg:mb-[2rem] underline">Animal Card</h1>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center min-h-screen -mt-20 mb-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {inputs.map((input) => (
                        <div
                            key={input.name}
                            className="flex w-full justify-center items-center gap-5"
                        >
                            <div className="basis-1/3 flex font-semibold justify-start items-center">
                                <label htmlFor={input.name} className="font-Kanit text-base">
                                    {input.label}:
                                </label>
                            </div>
                            <div className="basis-2/3">
                                <input
                                    className="block py-2.5 px-0 w-full text-sm font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                    type={input.type}
                                    id={input.name}
                                    placeholder={input.text}
                                    {...register(input.name, { required: true })}
                                />
                            </div>
                        </div>
                    ))}
                    <div className="pt-8">
                        <button
                            className="w-[350px] bg-blue-500 hover:bg-blue-600 font-Philosopher text-white font-bold py-2 px-4 rounded-lg hover:cursor-pointer"
                            type="submit"
                            disabled={animalLoading}
                        >
                            {animalLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CreateAnimal;