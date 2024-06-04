import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { SingleMedicalResponse } from "@/types/api-types";

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
    { name: "smoker", label: "Smoker?", text: "Smoker?", type: "text", options: ['Yes, currently', 'Used to, but quit', 'No'] },
    { name: "alcohol", label: "Alcohol Consumption", text: "Alcohol Consumption", type: "text", options: ['Regularly', 'Occasionally', 'Rarely', 'Never'] },
    { name: "routine", label: "Exercise Routine", text: "Exercise Routine", type: "text", options: ['Regularly', 'Occasionally', 'Sedentary lifestyle', 'Gym, Yoga, Running, etc.'] },
    { name: "diet", label: "Dietary Preferences", text: "Dietary Preferences", type: "text", options: ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free'] },
    { name: "mentalCondition", label: "History of Mental Health Conditions", text: "History of Mental Health Conditions", type: "text", options: ['Depression', 'Anxiety', 'Bipolar Disorder', 'PTSD', 'Eating Disorders', 'OCD'] },
    { name: "vaccinationHistory", label: "Routine Vaccinations Received", text: "Routine Vaccinations Received", type: "text", options: ['Influenza', 'Tetanus', 'Hepatitis', 'Measles, Mumps, Rubella (MMR)', 'COVID-19'] }
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
    const [progressBar, setProgressBar] = useState<number>(25);
    const [isMedical, setIsMedical] = useState<boolean>(id ? true : false);
    const [medicalLoading, setMedicalLoading] = useState<boolean>(false);

    const { user, isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const form = useForm({
        defaultValues: generateDefaultValues([perInfo, emCon, medAdd, healthHistory, healthhabits, inSur, medicalCondition]),
    });

    const { handleSubmit, register, reset, formState: { errors } } = form;

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

    const handleProgressForward = () => {
        setProgressBar(progressBar + 25);
    };

    const handleProgressBackward = () => {
        setProgressBar(progressBar - 25);
    };

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

        if (!isPaid && user?.role !== "admin") {
            navigate("/plans");
        } else {
            try {
                if (isMedical) {
                    await axios.put(`${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=medical`, medicalData, { withCredentials: true });
                    toast.success("Medical VCards updated!");
                } else {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/cards/new?type=medical`, medicalData, { withCredentials: true });
                    toast.success("Medical VCards created!");
                }
                navigate(-1);
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        }

        setMedicalLoading(false);
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center my-8">
                {/* progress bar */}
                <div className="flex justify-center lg:mt-4 lg:flex lg:justify-center lg:w-full">
                    <div className="w-[90%] h-4 bg-gray-300 rounded-full lg:w-[50%]">
                        <div
                            className="h-4 bg-blue-500 rounded-full"
                            style={{ width: `${(progressBar / 100) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* heading */}
                <div className="w-full py-4 lg:flex lg:justify-center">
                    <h1 className="font-Philosopher text-3xl font-bold pl-4">Medical Card</h1>
                </div>

                {/* form */}
                <div className="flex flex-col justify-center items-center lg:w-full">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:w-[30rem]">
                        <div className="space-y-4">
                            {progressBar === 25 && (
                                <>
                                    <div className="space-y-2">
                                        {perInfo.map((pIn, index) => (
                                            <div key={index} className="space-y-2 flex flex-row gap-10">
                                                <label htmlFor={`${pIn.name}`} className="basis-2/5 flex justify-start lg:justify-start font-Kanit text-lg items-center">{pIn.label}:</label>
                                                <input
                                                    className="basis-3/5 flex items-center py-2.5 px-0 w-full text-base font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                                    type={pIn.type}
                                                    id={pIn.name}
                                                    required
                                                    placeholder={pIn.text}
                                                    autoComplete="off"
                                                    {...register(pIn.name, { required: true })}
                                                />
                                                {errors[pIn.name] && (
                                                    <p className="text-red-500">{pIn.label} is required</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="font-semibold mt-4 font-Kanit text-lg underline">
                                            Emergency Contact
                                        </h1>
                                        {emCon.map((em, index) => (
                                            <div key={index} className="space-y-2 flex flex-row gap-10">
                                                <label htmlFor={`${em.name}`} className="basis-2/5 flex justify-start font-Kanit text-lg items-center">{em.label}:</label>
                                                <input
                                                    className="basis-3/5 flex items-center py-2.5 px-0 w-full text-base font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                                    type={em.type}
                                                    id={em.name}
                                                    required
                                                    autoComplete="off"
                                                    placeholder={em.text}
                                                    {...register(em.name, { required: true })}
                                                />
                                                {errors[em.name] && (
                                                    <p className="text-red-500">{em.label} is required</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {progressBar === 50 && (
                                <>
                                    <div className="space-y-1 w-full">
                                        <div className="lg:flex lg:justify-center">
                                            <h1 className="font-semibold mt-4 font-Philosopher text-lg underline pl-6">
                                                Address
                                            </h1>
                                        </div>
                                        {medAdd.map((em, index) => (
                                            <div key={index} className="space-y-2 flex flex-row">
                                                <label htmlFor={`${em.name}`} className="basis-1/4 flex justify-start lg:justify-center lg:mt-4 font-Kanit text-lg items-center">{em.label}:</label>
                                                <input
                                                    className="basis-3/4 flex items-center py-2.5 px-0 w-full text-lg font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                                    type={em.type}
                                                    id={em.name}
                                                    autoComplete="off"
                                                    required
                                                    placeholder={em.text}
                                                    {...register(em.name, { required: true })}
                                                />
                                                {errors[em.name] && (
                                                    <p className="text-red-500">{em.label} is required</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {healthHistory.map((sele, index) => (
                                        <div key={index} className="space-y-2">
                                            <label htmlFor={`${sele.name}`} className="w-full flex justify-start font-Kanit text-lg font-semibold items-center">{sele.label}:</label>
                                            <input
                                                className="tems-center w-full block py-2.5 px-0  text-base font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                                type={sele.type}
                                                id={sele.name}
                                                placeholder={sele.text}
                                                {...register(sele.name, { required: true })}
                                            />
                                            {errors[sele.name] && (
                                                <p className="text-red-500">{sele.label} is required</p>
                                            )}
                                        </div>
                                    ))}

                                    <div className="space-y-2">
                                        <label htmlFor="currentMedication" className="w-full flex justify-start font-Kanit text-lg font-semibold items-center pl-6 lg:pl-0">
                                            Current Medications:
                                        </label>
                                        <textarea
                                            className="items-center block py-2.5 px-0 w-full text-lg font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                            id="currentMedication"
                                            required
                                            autoComplete="off"
                                            placeholder="Current Medications"
                                            {...register("currentMedication", { required: true })}
                                        />
                                        {errors.current && (
                                            <p className="text-red-500">
                                                Current Medications is required
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="previousSurgeries" className="w-full flex justify-start font-Kanit text-lg font-semibold items-center pl-6 lg:pl-0">
                                            Previous Surgeries:
                                        </label>
                                        <input
                                            className="items-center block py-2.5 px-0 w-full text-lg font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                            type="text"
                                            id="previousSurgeries"
                                            required
                                            autoComplete="off"
                                            placeholder="Previous Surgeries"
                                            {...register("previousSurgeries", { required: true })}
                                        />
                                        {errors.current && (
                                            <p className="text-red-500">
                                                Current Medications is required
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                            {progressBar === 75 && (
                                <>
                                    {healthhabits.map((sele, index) => (
                                        <div key={index} className="space-y-2 w-full">
                                            <label htmlFor={`${sele.name}`} className="font-Kanit font-semibold text-lg pl-4 lg:pl-0 flex justify-start">
                                                {sele.label}
                                            </label>
                                            <select
                                                className="block py-2.5 px-0 w-full text-lg font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-slate-400 focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                                id={sele.name}
                                                required
                                                {...register(sele.name, { required: true })}
                                            >
                                                <option value="" className="">
                                                    {sele.text}
                                                </option>
                                                {sele.options.map((option, index) => (
                                                    <option key={index} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[sele.name] && (
                                                <p className="text-red-500">{sele.label} is required</p>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                        {progressBar === 100 && (
                            <>
                                <div className="w-full">
                                    <div className="lg:flex lg:justify-center">
                                        <h1 className="font-semibold font-Philosopher text-xl underline">
                                            Insurance Information
                                        </h1>
                                    </div>
                                    {inSur.map((em, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-row items-center w-full space-y-2 gap-8 my-2"
                                        >
                                            <label htmlFor={`${em.name}`} className="basis-1/4 flex justify-start lg:mt-4 font-Kanit text-lg">{em.label}:</label>
                                            <input
                                                className="basis-3/4 block py-2.5 px-0 w-full text-lg font-Philosopher bg-transparent border-0 border-b-2 border-black appearance-none text-slate-400 focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                                type="text"
                                                id={em.name}
                                                required
                                                placeholder={em.text}
                                                {...register(em.name, { required: true })}
                                            />
                                            {errors[em.name] && (
                                                <p className="text-red-500">{em.label} is required</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        <div className="w-full flex flex-row pt-8 pb-5">
                            <div className="basis-1/2 flex justify-center">
                                <button
                                    // type="button"
                                    className="px-4 py-2 bg-blue-500 rounded-lg hover:cursor-pointer hover:bg-blue-700 text-white font-Kanit disabled:bg-blue-300"
                                    onClick={handleProgressBackward}
                                    disabled={progressBar === 25}
                                >
                                    Back
                                </button>
                            </div>
                            <div className="basis-1/2 flex justify-center">
                                {(progressBar === 100) ? (
                                    <button
                                        className="px-4 py-2 bg-blue-500 rounded-lg hover:cursor-pointer hover:bg-blue-700 text-white font-Kanit"
                                        type="submit"
                                        disabled={medicalLoading}
                                    >
                                        {medicalLoading ? "Saving..." : "Save"}
                                    </button>
                                ) : (
                                    <button
                                        // type="button"
                                        className="px-4 py-2 bg-blue-500 rounded-lg hover:cursor-pointer hover:bg-blue-700 text-white font-Kanit"
                                        onClick={handleProgressForward}
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default MedicalInput;