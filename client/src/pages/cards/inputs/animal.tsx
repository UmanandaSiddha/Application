import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from 'react-toastify';
import { SingleAnimalResponse } from "@/types/api-types";
import axios from "axios";
import { useEffect, useState } from "react";
import SideBar from "@/components/rest/sidebar";
import { convertToStrings, generateSimpleDefaultValues } from "@/lib/helper";
import { Helmet } from "react-helmet-async";

const inputs = [
    { name: "name", label: "Animal Name", text: "Enter Animal Name" },
    { name: "scientificName", label: "Scientific Name", text: "Enter Scientific Name" },
    { name: "habitat", label: "Habitat", text: "Enter Habitat" },
    { name: "geographicalRange", label: "Geographical Range", text: "Enter Geographical Range" },
    { name: "physicalDescription", label: "Physical Description", text: "Enter Physical Description" },
    { name: "diet", label: "Diet", text: "Enter Diet" },
    { name: "lifespan", label: "Lifespan", text: "Enter Lifespan" },
    { name: "behavior", label: "Behavior", text: "Enter Behavior" },
    { name: "conservationStatus", label: "Conservation Status", text: "Enter Conservation Status" },
    { name: "ownerName", label: "Owner Name (for pets)", text: "Enter Owner Name" },
    { name: "location", label: "Location", text: "Enter Location" },
    { name: "caretakerMobileNumber", label: "Caretaker Mobile Number (if applicable)", text: "Enter Caretaker Mobile Number" },
    { name: "additionalNotes", label: "Additional Notes", text: "Enter Additional Notes" }
];

const CreateAnimal = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [isAnimal, setIsAnimal] = useState<boolean>(id ? true : false);
    const [animalLoading, setAnimalLoading] = useState<boolean>(false);

    const { user, isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const form = useForm({
        defaultValues: generateSimpleDefaultValues(inputs),
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
        const animalData = {
            ...values,
            user: user?._id,
        };
        if (!isPaid && user?.cards?.total! > 10 && user?.role !== "admin") {
            navigate("/plans");
        } else {
            setAnimalLoading(true);
            try {
                if (isAnimal) {
                    await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=animal`, animalData, { withCredentials: true });
                    // toast.success("Animal VCard Updated");
                } else {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=animal`, animalData, { withCredentials: true });
                    // toast.success("Animal VCard Created");
                }
                navigate(-1);
            } catch (error: any) {
                toast.error(error.response.data.message);
                navigate("/plans");
            } finally {
                setAnimalLoading(false);
            }
        }
    }

    return (
        <>
            <Helmet>
                <title>Voolata | Form animal</title>
                <meta name="description" content={`This is the animal form page of Voolata`} />
                <meta name="keywords" content="animal, form, voolata" />
            </Helmet>
            <div className="flex justify-center h-screen">
                <div className="flex flex-col lg:flex-row w-[90%] md:w-[85%] lg:w-[80%] space-y-4 lg:space-y-0 lg:space-x-4">
                    <div className="basis-1/4 hidden lg:block">
                        <SideBar />
                    </div>

                    <div className="flex-1 lg:basis-3/4">
                        <div className="h-full flex flex-col">
                            <h1 className="font-bold text-3xl md:text-4xl text-center mt-6 mb-4">
                                Animal
                            </h1>

                            <div className="flex justify-center w-full lg:w-[70%] mx-auto mb-4 px-4 md:px-0">
                                <div className="w-full h-2 bg-blue-100 rounded-full">
                                    <div
                                        className="h-2 bg-purple-400 rounded-full"
                                        style={{ width: `100%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col items-center">
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="space-y-6 w-full lg:w-[70%] px-4 md:px-0"
                                    >
                                        {inputs.map((input, index) => (
                                            <div
                                                className="relative flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4"
                                                key={index}
                                            >
                                                <label
                                                    htmlFor={input.name}
                                                    className="text-md font-semibold text-gray-700 w-full md:w-auto"
                                                >
                                                    {input.label}:
                                                </label>

                                                <div className="relative w-full md:flex-1">
                                                    <input
                                                        type={input.name === "caretakerMobileNumber" ? "number" : "text"}
                                                        id={input.name}
                                                        placeholder={input.text}
                                                        {...register(input.name)}
                                                        autoComplete="off"
                                                        className="peer h-10 w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                    />
                                                    <span className="absolute left-0 bottom-0 h-[2px] w-full bg-transparent scale-x-0 border-gray-500 transition-transform duration-300 peer-focus:scale-x-100 peer-focus:bg-gray-900"></span>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-center pb-2">
                                            <button
                                                className="px-4 py-2 mt-4 rounded-lg hover:cursor-pointer w-full lg:w-[70%] text-white bg-purple-500 text-lg"
                                                type="submit"
                                                disabled={animalLoading}
                                            >
                                                {animalLoading ? "APPLYING..." : "APPLY CHANGES"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateAnimal;