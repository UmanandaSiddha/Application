import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { SingleMedicalResponse } from "@/types/api-types";
import SideBar from "@/components/rest/sidebar";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const perInfo = [
    { name: "name", label: "Name", text: "Enter your name", type: "text" },
    { name: "dateOfBirth", label: "Date of Birth", text: "Enter your Date of Birth", type: "date" },
    { name: "gender", label: "Gender", text: "Enter your Gender", type: "text" },
    { name: "phone", label: "Phone Number", text: "Enter your Phone Number", type: "tel" },
    { name: "email", label: "Email Address", text: "Enter your Email Address", type: "email" }
];

const emCon = [
    { name: "emergencyName", label: "Name", text: "Enter Name", type: "text" },
    { name: "emergencyRelation", label: "Relation", text: "Enter Relationship", type: "text" },
    { name: "emergencyPhone", label: "Phone", text: "Enter Phone Number", type: "tel" }
];
const medAdd = [
    { name: "street", label: "Street", text: "Enter Street Address", type: "text" },
    { name: "city", label: "City", text: "Enter City", type: "text" },
    { name: "state", label: "State", text: "Enter State/Province", type: "text" },
    { name: "postalCode", label: "Postal", text: "Enter Postal Code", type: "number" }
];

const healthHistory = [
    {
        name: "allergyHistory", label: "Known Allergies", text: "Enter Known Allergies", type: "text",
        options: ['Medications', 'Foods', 'Insects', 'Latex', 'Pollen']
    },
    {
        name: "chronicHistory", label: "Chronic Medical Conditions", text: "Enter Chronic Medical Conditions", type: "text",
        options: ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Arthritis', 'Thyroid Disorder', 'Chronic Pain', 'Respiratory Issues']
    }
];

const medicalCondition = [
    { name: "currentMedication", label: "Current Medications", text: "Current Medications", type: "textarea" },
    { name: "previousSurgeries", label: "Previous Surgeries", text: "Previous Surgeries", type: "textarea" },
];

const healthhabits = [
    { name: "smoker", label: "Smoker", text: "Smoker", type: "text", options: ['Yes, currently', 'Used to, but quit', 'No'] },
    { name: "alcohol", label: "Alcohol Consumption", text: "Alcohol Consumption", type: "text", options: ['Regularly', 'Occasionally', 'Rarely', 'Never'] },
    { name: "exercise", label: "Exercise Routine", text: "Exercise Routine", type: "text", options: ['Regularly', 'Occasionally', 'Sedentary lifestyle', 'Gym, Yoga, Running, etc.'] },
    { name: "diet", label: "Dietary Preferences", text: "Dietary Preferences", type: "text", options: ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free'] },
    { name: "mentalCondition", label: "Mental Health ", text: "Mental Health", type: "text", options: ['Depression', 'Anxiety', 'Bipolar Disorder', 'PTSD', 'Eating Disorders', 'OCD'] },
    { name: "vaccinationHistory", label: "Routine Vaccinations", text: "Routine Vaccinations", type: "text", options: ['Influenza', 'Tetanus', 'Hepatitis', 'Measles, Mumps, Rubella (MMR)', 'COVID-19'] }
];

const inSur = [
    { name: "insuranceProvider", label: "Provider", text: "Insurance Provider", type: "text" },
    { name: "insurancePolicyNumber", label: "Policy", text: "Policy Number", type: "number" },
    { name: "insuranceGrpNumber", label: "Group", text: "Group Number (if applicable)", type: "number" }
];

const generateDefaultValues = (arrays: { name: string }[][]) => {
    return arrays.reduce((acc, array) => {
        array.forEach(field => {
            acc[field.name] = "";
        });
        return acc;
    }, {} as Record<string, string>);
};

const convertToStrings = (data: any) => {
    return Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key] !== undefined && data[key] !== null ? String(data[key]) : "";
        return acc;
    }, {} as Record<string, string>);
};

const MedicalInput = () => {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("medicalId");
    const [progressBar, setProgressBar] = useState<number>(1);
    const [isMedical, setIsMedical] = useState<boolean>(id ? true : false);
    const [medicalLoading, setMedicalLoading] = useState<boolean>(false);

    const { user, isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const form = useForm({
        defaultValues: generateDefaultValues([perInfo, emCon, medAdd, healthHistory, healthhabits, inSur, medicalCondition]),
    });

    const { handleSubmit, register, reset } = form;

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

        console.log("Form submitted with values:", values)

        setMedicalLoading(true);

        const inputs = [...perInfo, ...emCon, ...medAdd, ...healthHistory, ...healthhabits, ...inSur, ...medicalCondition];
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
            try {
                if (isMedical) {
                    await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=medical`, medicalData, { withCredentials: true });
                    // toast.success("Medical VCards updated!");
                } else {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=medical`, medicalData, { withCredentials: true });
                    // toast.success("Medical VCards created!");
                }
                navigate(-1);
            } catch (error: any) {
                toast.error(error.response.data.message);
                navigate("/plans");
            }
        }

        setMedicalLoading(false);
    };

    const formParts = () => {
        switch (progressBar) {
            case 1:
                return (
                    <>
                        {perInfo?.map((pIn, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label
                                    htmlFor={pIn.name}
                                    className="text-md font-semibold text-gray-700 min-w-24"
                                >
                                    {pIn.label}:
                                </label>
                                <div className="relative h-11 w-full min-w-56">
                                    <input
                                        type={pIn.type}
                                        id={pIn.name}
                                        placeholder={pIn.text}
                                        {...register(pIn.name, { required: true })}
                                        autoComplete="off"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}

                        <h1 className="text-2xl font-bold">Emergency Contact</h1>
                        {emCon?.map((em, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label
                                    htmlFor={em.name}
                                    className="text-md font-semibold text-gray-700 min-w-24"
                                >
                                    {em.label}:
                                </label>
                                <div className="relative h-11 w-full min-w-56">
                                    <input
                                        type={em.type}
                                        id={em.name}
                                        placeholder={em.text}
                                        {...register(em.name, { required: true })}
                                        autoComplete="off"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}
                    </>
                )
            case 2:
                return (
                    <>
                        <h1 className="text-2xl font-bold">Address</h1>
                        {medAdd?.map((em, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label
                                    htmlFor={em.name}
                                    className="text-md font-semibold text-gray-700 min-w-24"
                                >
                                    {em.label}:
                                </label>
                                <div className="relative h-11 w-full min-w-56">
                                    <input
                                        type={em.type}
                                        id={em.name}
                                        placeholder={em.text}
                                        {...register(em.name, { required: true })}
                                        autoComplete="off"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}

                        <h1 className="text-2xl font-bold">Medical History</h1>
                        {healthHistory?.map((em, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label
                                    htmlFor={em.name}
                                    className="text-md font-semibold text-gray-700 min-w-24"
                                >
                                    {em.label}:
                                </label>
                                <div className="relative h-11 w-full min-w-56">
                                    <input
                                        type={em.type}
                                        id={em.name}
                                        placeholder={em.text}
                                        {...register(em.name, { required: true })}
                                        autoComplete="off"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}
                    </>
                )
            case 3:
                return (
                    <>
                        <h1 className="text-2xl font-bold">Health Habits</h1>
                        {healthhabits?.map((sele, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label className="text-md font-semibold text-gray-700 min-w-24" htmlFor={sele.name}>
                                    {sele.label}:
                                </label>
                                <div className="relative h-11 w-full min-w-56">
                                    <select
                                        id={sele.name}
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                        {...register(sele.name, { required: true })}
                                    >
                                        <option key={index} value="" disabled className="text-slate-400">{sele.label}</option>
                                        {sele.options.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}
                    </>
                )
            case 4:
                return (
                    <>
                        <h1 className="text-2xl font-bold">Medical Conditions</h1>
                        {medicalCondition?.map((em, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label
                                    htmlFor={em.name}
                                    className="text-md font-semibold text-gray-700 min-w-24"
                                >
                                    {em.label}:
                                </label>
                                <div className="relative w-full min-w-56">
                                    <textarea
                                        {...register(em.name, { required: true })}
                                        placeholder={em.text}
                                        id={em.name}
                                        autoComplete="off"
                                        className="peer h-full min-h-[100px] w-full resize-none border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                                    ></textarea>
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}

                        <h1 className="text-2xl font-bold">Insurance Information</h1>
                        {inSur?.map((em, index) => (
                            <div className="relative w-full min-w-56 flex items-center space-x-4 md:space-x-8 lg:space-x-16" key={index}>
                                <label
                                    htmlFor={em.name}
                                    className="text-md font-semibold text-gray-700 min-w-24"
                                >
                                    {em.label}:
                                </label>
                                <div className="relative h-11 w-full min-w-56">
                                    <input
                                        type={em.type}
                                        id={em.name}
                                        placeholder={em.text}
                                        {...register(em.name, { required: true })}
                                        autoComplete="off"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                                </div>
                            </div>
                        ))}
                    </>
                )
        }
    }

    return (
        <div className="flex justify-center">
            <div className="flex flex-row w-[80%] md:space-x-4 lg:space-x-4">
                <div className="basis-1/4 hidden lg:block xl:block">
                    <SideBar />
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 lg:w-full">
                    <div className="basis-full gap-20 max-sm:gap-5 flex max-sm:flex-col justify-center items-center lg:basis-3/4  lg:max-h-screen">
                        <button
                            className="px-4 sm:flex hidden  py-2 mt-4 justify-center items-center hover:cursor-pointer rounded-full h-20 w-20 text-white bg-blue-500 text-lg"
                            type="button"
                            disabled={progressBar === 1}
                            onClick={() => {
                                setProgressBar((currPage) => currPage - 1);
                            }}
                        >
                            <FaArrowLeft className="text-3xl" />

                        </button>
                        <div className="h-[85vh] flex flex-col overflow-y-scroll mb-4 hide-scrollbar">
                            <h1 className="font-bold text-4xl text-center mt-6 mb-16 lg:mb-12">Medical</h1>
                            <div className="flex flex-col  justify-center items-center lg:w-full">
                                <div className="flex flex-col gap-6 justify-center pb-10">
                                    <div className="flex justify-center lg:mt-4 mb-10 lg:flex lg:justify-center">
                                        <div className="w-full h-4 bg-blue-100 rounded-full">
                                            <div
                                                className="h-4 bg-blue-500 rounded-full"
                                                style={{ width: `${(progressBar / 4) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {formParts()}
                                    <div className="flex justify-center space-x-4">
                                    </div>
                                </div>
                                <div className="flex gap-5 mx-auto ">
                                    <button
                                        className="px-4 sm:hidden py-2 mt-4 justify-center items-center hover:cursor-pointer rounded-lg h-14 w-36 text-white bg-blue-500 text-lg"
                                        type="button"
                                        disabled={progressBar === 1}
                                        onClick={() => {
                                            setProgressBar((currPage) => currPage - 1);
                                        }}
                                    >
                                        Prev

                                    </button>
                                    {progressBar === 4 ? (
                                        <></>
                                    ) : (
                                        <button
                                            className="px-4 py-2 mt-4 sm:hidden rounded-lg flex justify-center items-center h-14 w-36 hover:cursor-pointer text-white bg-blue-500 text-lg"
                                            type="button"
                                            disabled={progressBar === 4}
                                            onClick={() => {
                                                setProgressBar((currPage) => currPage + 1);
                                            }}
                                        >
                                            Next
                                        </button>
                                    )}
                                    {progressBar === 4 ?

                                        <button
                                            className="justify-center items-center flex py-2 mt-4 rounded-lg hover:cursor-pointer sm:w-96 text-white bg-[#3FA398] w-36 sm:text-lg"
                                            type="submit"
                                            disabled={medicalLoading}
                                        >
                                            {medicalLoading ? "APPLYING..." : "APPLY CHANGES"}
                                        </button>
                                        :
                                        <></>
                                    }
                                </div>
                            </div>
                        </div>
                        {progressBar === 4 ? (
                            <></>
                        ) : (
                            <button
                                className="px-4 py-2 mt-4 hidden sm:flex rounded-full  justify-center items-center h-20 w-20 hover:cursor-pointer text-white bg-blue-500 text-lg"
                                type="button"
                                disabled={progressBar === 4}
                                onClick={() => {
                                    setProgressBar((currPage) => currPage + 1);
                                }}
                            >
                                <FaArrowRight className="text-3xl" />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MedicalInput;