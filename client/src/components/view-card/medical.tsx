import { MedicalType } from "@/types/card_types";
import { MdLocationOn } from "react-icons/md";
import { BsShieldPlus } from "react-icons/bs";

interface PropsType {
    card: MedicalType | null;
}

const MedicalComponent = ({ card }: PropsType) => {

    const birthDate = card?.dateOfBirth
        ? new Date(card.dateOfBirth)
        : null;

    const formattedDate = birthDate ? birthDate.toLocaleDateString() : "";

    const data = [
        {
            name: "Known Allergies",
            multiple: true,
            value: card?.allergyHistory === "Other" ? card.allergyHistory_Other : card?.allergyHistory,
            originValue: card?.allergyHistory
        },
        {
            name: "Chronic Meical Conditions",
            multiple: true,
            value: card?.chronicHistory === "Other" ? card.chronicHistory_Other : card?.chronicHistory
        },
        {
            name: "Current Medications",
            value: card?.currentMedication,
        },
        {
            name: "Smoker",
            value: card?.smoker,
        },
        {
            name: "Alcohol Consumption",
            value: card?.alcohol,
        },
        {
            name: "Exercise Routine",
            value: card?.exercise === "Other" ? card.exercise_Other : card?.exercise,
        },
        {
            name: "Dietary Preferences",
            value: card?.diet === "Other" ? card.diet_Other : card?.diet,
        },
        {
            name: "Mental Condition",
            multiple: true,
            value: card?.mentalCondition,
        },
        {
            name: "Vaccination History",
            multiple: true,
            value: card?.vaccinationHistory,
        },
        {
            name: "Previous Surgeries",
            value: card?.previousSurgeries,
        }
    ];

    return (
        <div className="bg-[#478AFB] bg-[url('/medical_bg.png')] bg-bottom bg-cover pb-32 md:pb-6">
            <div className="relative mb-20 rounded-[10px]  z-10 ">
                <img src="/card_header_bg.png" alt="" className="w-full h-80 hidden sm:block" />
                <img src="/medical_header_mobile.png" alt="" className="w-full h-72 sm:hidden" />
                <div className="pt-10 pl-5 absolute top-5">
                    <div className="flex justify-start pl-6 sm:py-6">
                        <p className="text-white font-semibold">Medical Data</p>
                    </div>
                    <div className="text-white text-5xl lg:text-5xl xl:text-6xl sm:text-4xl font-semibold mb-10">
                        <h1 className="pl-6">{card?.name}</h1>
                    </div>
                </div>
            </div>

            <div className="md:w-[550px] w-[370px] relative bg-[#ACC1E4] bg-opacity-80 rounded-3xl mb-24 pt-10  mx-auto ">

                <div className="w-full mt-6 flex flex-col items-center justify-start gap-4 px-8">
                    <div className="w-full bg-white py-4 px-6 rounded-3xl shadow-[4px_17px_16px_3px_rgba(0,_0,_0,_0.1)]">
                        <p className="text-2xl font-semibold">{card?.name}</p>
                        <p className="text-md">{card?.gender}</p>
                        <hr className="text-slate-400 my-3" />
                        <p className="text-md"><span className="font-semibold">Date of Birth:</span> {formattedDate}</p>
                        <p className="text-md"><span className="font-semibold">Phone:</span> {card?.phone}</p>
                        <p className="text-md"><span className="font-semibold">Email:</span> {card?.email}</p>
                        <p className="text-md"><span className="font-semibold">Height:</span> {card?.height} meters</p>
                        <p className="text-md"><span className="font-semibold">Weight:</span> {card?.weight} kgs</p>
                        <p className="text-md"><span className="font-semibold">Age:</span> {card?.age}</p>
                        <p className="text-md"><span className="font-semibold">Blood Group:</span> {card?.blood}</p>
                    </div>
                </div>

                <div className="w-full mt-4 flex flex-col items-center justify-start gap-4 px-8">
                    <div className="w-full bg-white py-4 px-6 rounded-3xl">
                        <p className="text-2xl font-semibold flex items-center gap-2">Address <span><MdLocationOn size={20} className="text-red-500" /></span></p>
                        <hr className="text-slate-400 my-3" />
                        <p className="text-md"><span className="font-semibold">Street:</span> {card?.street}</p>
                        <p className="text-md"><span className="font-semibold">City:</span> {card?.city}</p>
                        <p className="text-md"><span className="font-semibold">State:</span> {card?.state}</p>
                        <p className="text-md"><span className="font-semibold">Postal Code:</span> {card?.postalCode}</p>
                    </div>
                </div>

                <div className="mt-4 ml-8 lg:ml-10">
                    <div className="font-semibold text-lg">
                        Emergency Contact
                    </div>
                    <div className="bg-white rounded-3xl w-[15rem] my-2">
                        <div className="py-2 flex flex-col justify-center items-center">
                            <p className="text-lg">
                                {card?.emergencyName}
                            </p>
                            <p className="text-slate-600 text-sm">
                                {card?.emergencyRelation}
                            </p>
                            <p className="text-slate-600 text-sm">
                                {card?.emergencyPhone}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="py-6 flex justify-center w-full">
                    <div className="w-[90%]">
                        {data.map((item, index) => (
                            <div key={index} className="flex flex-col gap-y-2 py-2">
                                <p className="text-lg font-semibold">{item.name}:</p>
                                {item?.multiple && item.originValue !== "Other" ? (
                                    <ul className="bg-white border-2 flex-wrap flex gap-3 border-slate-200 w-full rounded-lg px-3 py-1 text-lg ">
                                        {item.value?.split(",").map((it, index) => (
                                            <li key={index} className="p-3 h-10 flex items-center justify-center bg-gray-200 rounded-xl">{it}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="bg-white border-2 border-slate-200 w-full h-12 rounded-lg px-3 py-1 text-lg">{item.value}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full pb-20 mt-1 flex flex-col items-center justify-start gap-4 px-8">
                    <div className="w-full bg-white py-4 px-6 rounded-3xl">
                        <p className="text-2xl font-semibold flex items-center gap-2">Insurance <span><BsShieldPlus size={20} className="text-green-500" /></span></p>
                        <hr className="text-slate-400 my-3" />
                        <p className="text-md"><span className="font-semibold">Provider:</span> {card?.insuranceProvider}</p>
                        <p className="text-md"><span className="font-semibold">Policy Number:</span> {card?.insurancePolicyNumber}</p>
                        <p className="text-md"><span className="font-semibold">Group Number:</span> {card?.insuranceGrpNumber}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalComponent;