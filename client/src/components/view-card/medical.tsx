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
        <div className=" bg-bottom bg-cover pb-32 md:pb-6 border-2">
            <div className="relative flex justify-center items-center ">
                <img src="/medical_cover.png" alt="" className="w-full h-80 sm:h-96  sm:hidden" />
                {/* <img src="/medical_header_mobile.png" alt="" className="w-full h-72 sm:hidden" /> */}
                <div className="absolute top-5">
                    <div className="flex flex-col gap-2 justify-center items-center sm:py-4">
                        <img src="/person_img.png" alt="" className="sm:w-32" />
                        <p className="text-white font-bold text-5xl pt-2">David Storm</p>
                    </div>
                </div>
            </div>

            <div className="md:w-[550px] w-[370px] bg-[#F8F8F8] relative  bg-opacity-80 rounded-3xl mb-24 mt-16  mx-auto">
                <div className="w-full mt-6 flex flex-col items-center justify-start gap-4 px-8">
                    <div className="w-full  py-4 mt-10 rounded-3xl ">
                        <p className="text-3xl font-semibold">{card?.name}</p>
                        <p className="text-xl">{card?.gender}</p>
                        <hr className="text-slate-400 my-3" />
                        <p className="text-xl"><span className="font-semibold">Date of Birth:</span> {formattedDate}</p>
                        <p className="text-xl"><span className="font-semibold">Phone:</span> {card?.phone}</p>
                        <p className="text-xl"><span className="font-semibold">Email:</span> {card?.email}</p>
                        <p className="text-xl"><span className="font-semibold">Height:</span> {card?.height} meters</p>
                        <p className="text-xl"><span className="font-semibold">Weight:</span> {card?.weight} kgs</p>
                        <p className="text-xl"><span className="font-semibold">Age:</span> {card?.age}</p>
                        <p className="text-xl"><span className="font-semibold">Blood Group:</span> {card?.blood}</p>
                    </div>
                </div>

                <div className="w-full mt-4 flex flex-col items-center justify-start gap-4 px-8">
                    <div className="w-full  py-4 rounded-3xl">
                        <p className="text-3xl font-semibold flex items-center gap-2">Address <span><MdLocationOn size={20} className="text-red-500" /></span></p>
                        <hr className="text-slate-400 my-3" />
                        <p className="text-xl"><span className="font-semibold">Street:</span> {card?.street}</p>
                        <p className="text-xl"><span className="font-semibold">City:</span> {card?.city}</p>
                        <p className="text-xl"><span className="font-semibold">State:</span> {card?.state}</p>
                        <p className="text-xl"><span className="font-semibold">Postal Code:</span> {card?.postalCode}</p>
                    </div>
                </div>

                <div className="mt-4 ml-8 lg:ml-10">
                    <div className="font-semibold text-3xl pb-3">
                        SOS
                    </div>
                    <div className="bg-[#FFE5E5] rounded-xl flex justify-center w-44 my-2">
                        <div className="py-5 flex flex-col items-center justify-center gap-2">
                            <p className="text-lg">
                                {card?.emergencyName}
                            </p>
                            <p className="text-slate-600 text-sm">
                                {card?.emergencyRelation}
                            </p>
                            {/* <p className="text-slate-600 text-sm">
                                {card?.emergencyPhone}
                            </p> */}
                            <div className="w-full h-10 flex justify-center items-center rounded-md bg-[#E0EBFB]">
                                <h1 className="text-[#3567B0] font-semibold text-xl">Call</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-6 flex justify-center w-full">
                    <div className="w-[90%]">
                        {data.map((item, index) => (
                            <div key={index} className="flex flex-col gap-y-2 py-2 ml-3">
                                <p className="text-3xl pb-3 font-semibold">{item.name}:</p>
                                {item?.multiple && item.originValue !== "Other" ? (
                                    <ul className=" flex-wrap flex gap-3 border-slate-200 w-full rounded-lg px-3 py-1 text-lg ">
                                        {item.value?.split(",").map((it, index) => (
                                            <li key={index} className="p-5 h-12 flex items-center justify-center bg-[#E0EBFB] text-[#3567B0] text-xl font-semibold rounded-lg">{it}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="border-b-2 w-full h-12  px-3 py-1 text-lg">{item.value}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full pb-20  mt-1 flex flex-col items-center justify-start gap-4 px-8">
                    <div className="w-full bg-white py-4 px-6 rounded-3xl">
                        <p className="text-2xl font-semibold flex items-center gap-2">Insurance <span><BsShieldPlus size={20} className="text-green-500" /></span></p>
                        <hr className="text-slate-400 my-3" />
                        <p className="text-md"><span className="font-semibold">Provider:</span> {card?.insuranceProvider}</p>
                        <p className="text-md"><span className="font-semibold">Policy Number:</span> {card?.insurancePolicyNumber}</p>
                        <p className="text-md"><span className="font-semibold">Group Number:</span> {card?.insuranceGrpNumber}</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center  pb-20">
                    <p className="pb-3 text-xl font-semibold">Made with</p>
                    <img src="/voolata_long_r.png" alt="" className="w-36" />
                </div>
            </div>
        </div>
    );
};

export default MedicalComponent;