import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { SingleMedicalResponse } from "@/types/api-types";
import SideBar from "@/components/rest/sidebar";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { convertToStrings, generateDefaultValues } from "@/lib/helper";
import SelectInput from "@/components/rest/select-input";
import {
    emCon,
    healthhabits,
    healthHistory,
    inSur,
    medAdd,
    medDetailBlood,
    medDetails,
    medicalCondition,
    otherInputs,
    perInfo
} from "@/data/medical";
import TextInput from "@/components/rest/text-input";

const MedicalInput = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [progressBar, setProgressBar] = useState<number>(1);
    const [isMedical, setIsMedical] = useState<boolean>(id ? true : false);
    const [medicalLoading, setMedicalLoading] = useState<boolean>(false);

    const { user, isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const form = useForm({
        defaultValues: generateDefaultValues([
            perInfo,
            emCon,
            medAdd,
            healthHistory,
            healthhabits,
            inSur,
            medicalCondition
        ]),
    });

    const { handleSubmit, register, reset, watch, setValue } = form;

    useEffect(() => {
        const fetchMedical = async () => {
            if (id) {
                try {
                    const { data }: { data: SingleMedicalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/cards/detailed/${id}?type=medical`, { withCredentials: true });
                    setIsMedical(true);
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
                fetchMedical();
            } else {
                setIsMedical(true);
                reset(convertToStrings(cardDataParsed));
            }
        } else {
            fetchMedical();
        }
    }, [id, reset]);

    const onSubmit = async (values: any) => {
        const inputs = [...perInfo, ...emCon, ...medAdd, ...medDetails, ...otherInputs, ...medDetailBlood, ...healthHistory, ...healthhabits, ...inSur, ...medicalCondition];
        const convertedValues = inputs.reduce((acc, input) => {
            if (input.type === "number") {
                acc[input.name] = Number(values[input.name]);
            } else {
                acc[input.name] = values[input.name];
            }
            return acc;
        }, {} as Record<string, any>);

        const medicalData = {
            ...convertedValues,
            user: user?._id,
        };

        if (!isPaid && user?.cards?.total! > 10 && user?.role !== "admin") {
            navigate("/plans");
        } else {
            setMedicalLoading(true);
            try {
                if (isMedical) {
                    await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=medical`, medicalData, { withCredentials: true });
                } else {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=medical`, medicalData, { withCredentials: true });
                }
                navigate(-1);
            } catch (error: any) {
                toast.error(error.response.data.message);
                navigate("/plans");
            } finally {
                setMedicalLoading(false);
            }
        }
    };

    const formParts = () => {
        switch (progressBar) {
            case 1:
                return (
                    <div className="space-y-4">
                        {perInfo?.map((sele, index) => (
                            <TextInput
                                key={index}
                                name={sele.name}
                                label={sele.label}
                                text={sele.text}
                                type={sele.type}
                                register={register}
                            />
                        ))}

                        <h1 className="pt-4 text-2xl font-semibold">Emergency Contact</h1>
                        {emCon?.map((sele, index) => (
                            <TextInput
                                key={index}
                                name={sele.name}
                                label={sele.label}
                                text={sele.text}
                                type={sele.type}
                                register={register}
                            />
                        ))}
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-4">
                        <h1 className="pt-4 text-2xl font-semibold">Address</h1>
                        {medAdd?.map((sele, index) => (
                            <TextInput
                                key={index}
                                name={sele.name}
                                label={sele.label}
                                text={sele.text}
                                type={sele.type}
                                register={register}
                            />
                        ))}

                        <h1 className="pt-4 text-2xl font-semibold">Medical History</h1>
                        {healthHistory?.map((sele, index) => {
                            const selectedValue = watch(sele.name);
                            return (
                                <SelectInput
                                    key={index}
                                    name={sele.name}
                                    text={sele.text}
                                    label={sele.label}
                                    options={sele.options}
                                    selectedValue={selectedValue}
                                    setValue={setValue}
                                    register={register}
                                />
                            )
                        })}
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-4">
                        <h1 className="pt-4 text-2xl font-semibold">Medical Details</h1>
                        {medDetails?.map((sele, index) => (
                            <TextInput
                                key={index}
                                name={sele.name}
                                label={sele.label}
                                text={sele.text}
                                type={sele.type}
                                register={register}
                            />
                        ))}

                        {medDetailBlood.map((sele, index) => {
                            const selectedValue = watch(sele.name);
                            return (
                                <SelectInput
                                    key={index}
                                    name={sele.name}
                                    text={sele.text}
                                    label={sele.label}
                                    options={sele.options}
                                    selectedValue={selectedValue}
                                    setValue={setValue}
                                    register={register}
                                />
                            )
                        })}

                        <h1 className="pt-4 text-2xl font-semibold">Health Habits</h1>
                        {healthhabits?.map((sele, index) => {
                            const selectedValue = watch(sele.name);
                            return (
                                <SelectInput
                                    key={index}
                                    name={sele.name}
                                    text={sele.text}
                                    label={sele.label}
                                    options={sele.options}
                                    selectedValue={selectedValue}
                                    setValue={setValue}
                                    register={register}
                                />
                            )
                        })}
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-4">
                        <h1 className="pt-4 text-2xl font-semibold">Medical Conditions</h1>
                        {medicalCondition?.map((sele, index) => (
                            <TextInput
                                key={index}
                                name={sele.name}
                                label={sele.label}
                                text={sele.text}
                                type={sele.type}
                                register={register}
                            />
                        ))}

                        <h1 className="pt-4 text-2xl font-semibold">Insurance Information</h1>
                        {inSur?.map((sele, index) => (
                            <TextInput
                                key={index}
                                name={sele.name}
                                label={sele.label}
                                text={sele.text}
                                type={sele.type}
                                register={register}
                            />
                        ))}
                    </div>
                )
        }
    }

    return (
        <div className="flex justify-center h-screen">
            <div className="flex flex-col lg:flex-row w-[90%] md:w-[85%] lg:w-[80%] space-y-6 lg:space-y-0 lg:space-x-4">
                <div className="basis-1/4 hidden lg:block">
                    <SideBar />
                </div>

                <div className="flex-1 flex flex-col">
                    <h1 className="font-bold text-3xl md:text-4xl text-center mt-6 mb-4">
                        Medical
                    </h1>

                    <div className="flex justify-center w-full lg:w-[70%] mx-auto mb-4 px-4 md:px-0">
                        <div className="w-full h-2 bg-blue-100 rounded-full">
                            <div
                                className="h-2 bg-purple-400 rounded-full"
                                style={{ width: `${(progressBar / 4) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col space-y-2 w-full lg:w-[90%] mx-auto px-4 md:px-0"
                    >
                        <div className="flex gap-10 lg:gap-20 justify-center items-center">
                            <button
                                className="hidden sm:flex px-3 py-2 justify-center items-center rounded-full h-14 w-14 text-white bg-purple-400 text-base"
                                type="button"
                                disabled={progressBar === 1}
                                onClick={() => setProgressBar((currPage) => currPage - 1)}
                            >
                                <FaArrowLeft />
                            </button>

                            <div className="sm:h-[75vh] w-full overflow-y-auto hide-scrollbar flex-1 flex flex-col">
                                {formParts()}
                            </div>

                            <button
                                className="hidden sm:flex px-3 py-2 justify-center items-center rounded-full h-14 w-14 text-white bg-purple-400 text-base"
                                type="button"
                                disabled={progressBar === 4}
                                onClick={() => setProgressBar((currPage) => currPage + 1)}
                            >
                                <FaArrowRight />
                            </button>
                        </div>

                        <div className="flex justify-center w-full lg:w-[70%] mx-auto gap-4 pb-4">
                            <button
                                className="sm:hidden px-4 py-2 mt-4 rounded-lg hover:cursor-pointer w-full text-white bg-[#4688fa] text-lg"
                                type="button"
                                disabled={progressBar === 1}
                                onClick={() => setProgressBar((currPage) => currPage - 1)}
                            >
                                Prev
                            </button>
                            {progressBar === 4 ? (
                                <button
                                    className="px-4 py-2 mt-4 rounded-lg hover:cursor-pointer w-full text-white bg-[#4688fa] text-lg"
                                    type="submit"
                                    disabled={medicalLoading}
                                >
                                    {medicalLoading ? "Hold on..." : "Submit"}
                                </button>
                            ) : (
                                <button
                                    className="sm:hidden px-4 py-2 mt-4 rounded-lg hover:cursor-pointer w-full text-white bg-[#4688fa] text-lg"
                                    type="button"
                                    onClick={() => setProgressBar((currPage) => currPage + 1)}
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MedicalInput;