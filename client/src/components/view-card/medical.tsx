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
            value: card?.allergyHistory
        },
        {
            name: "Chronic Meical Conditions",
            value: card?.chronicHistory
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
            value: card?.exercise,
        },
        {
            name: "Dietary Preferences",
            value: card?.diet,
        },
        {
            name: "Mental Condition",
            value: card?.mentalCondition,
        },
        {
            name: "Vaccination History",
            value: card?.vaccinationHistory,
        },
        {
            name: "Previous Surgeries",
            value: card?.previousSurgeries,
        }
    ];

    return (
        <div className="bg-indigo-100 pb-32 md:pb-6">
            <div className="bg-indigo-400 py-4 rounded-br-[4rem] rounded-bl-[3rem] z-10 shadow-lg">
                <div className="flex justify-start pl-6 py-4">
                    <p className="text-white">MEDICAL DATA</p>
                </div>
                <div className="text-5xl font-semibold mb-10">
                    <h1 className="pl-6 text-3xl md:text-5xl text-white">{card?.name}</h1>
                </div>
            </div>

            {/* <div className="my-4 w-full flex flex-col lg:flex-row items-center justify-center gap-4 px-8">
                <div className="bg-white p-4 rounded-3xl w-full lg:w-1/2">
                    <p className="text-2xl font-semibold">{card?.name}</p>
                    <hr className="text-slate-400 my-3" />
                    <p className="text-md"><span className="font-semibold">Gender:</span> {card?.gender}</p>
                    <p className="text-md"><span className="font-semibold">DOB:</span> {formattedDate}</p>
                    <p className="text-md"><span className="font-semibold">Phone:</span> {card?.phone}</p>
                    <p className="text-md"><span className="font-semibold">Email:</span> {card?.email}</p>
                </div>
                <div className="bg-white p-4 rounded-3xl w-full lg:w-1/2">
                    <p className="text-2xl font-semibold flex items-center gap-2">Address <span><MdLocationOn size={20} className="text-red-500" /></span></p>
                    <hr className="text-slate-400 my-3" />
                    <p className="text-md"><span className="font-semibold">Street:</span> {card?.street}</p>
                    <p className="text-md"><span className="font-semibold">City:</span> {card?.city}</p>
                    <p className="text-md"><span className="font-semibold">State:</span> {card?.state}</p>
                    <p className="text-md"><span className="font-semibold">Postal Code:</span> {card?.postalCode}</p>
                </div>
            </div> */}

            <div className="w-full mt-6 flex flex-col items-center justify-start gap-4 px-8">
                <div className="w-full bg-white py-4 px-6 rounded-3xl">
                    <p className="text-2xl font-semibold">{card?.name}</p>
                    <p className="text-md">{card?.gender}</p>
                    <hr className="text-slate-400 my-3" />
                    <p className="text-md"><span className="font-semibold">Date of Birth:</span> {formattedDate}</p>
                    <p className="text-md"><span className="font-semibold">Phone:</span> {card?.phone}</p>
                    <p className="text-md"><span className="font-semibold">Email:</span> {card?.email}</p>
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
                            <p className="bg-white border-2 border-slate-200 w-full rounded-lg px-3 py-1 text-lg shadow-lg">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full mt-1 flex flex-col items-center justify-start gap-4 px-8">
                <div className="w-full bg-white py-4 px-6 rounded-3xl">
                    <p className="text-2xl font-semibold flex items-center gap-2">Insurance <span><BsShieldPlus size={20} className="text-green-500" /></span></p>
                    <hr className="text-slate-400 my-3" />
                    <p className="text-md"><span className="font-semibold">Provider:</span> {card?.insuranceProvider}</p>
                    <p className="text-md"><span className="font-semibold">Policy Number:</span> {card?.insurancePolicyNumber}</p>
                    <p className="text-md"><span className="font-semibold">Group Number:</span> {card?.insuranceGrpNumber}</p>
                </div>
            </div>
        </div>
    );
};

export default MedicalComponent;