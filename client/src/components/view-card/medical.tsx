import { MedicalType } from "@/types/card_types";
import { MdLocationOn } from "react-icons/md";

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
    ];

    return (
        <div className="bg-blue-100">
            <div className="bg-blue-400 py-4 rounded-br-[4rem] rounded-bl-[3rem] z-10 shadow-lg">
                <div className="flex justify-start font-Kanit pl-6 py-4">
                    <p>MEDICAL DATA</p>
                </div>
                <div className="font-Kanit text-5xl font-bold mb-10">
                    <h1 className="font-Alice pl-6">{card?.name}</h1>
                </div>
            </div>

            <div className="my-4 w-full flex flex-col lg:flex-row items-center justify-center gap-4 px-8">
                <div className="bg-white p-4 rounded-3xl w-full lg:w-1/2">
                    <p className="font-Kanit text-2xl font-bold">{card?.name}</p>
                    <hr className="text-slate-400 my-3" />
                    <p>Gender: {card?.gender}</p>
                    <p>DOB: {formattedDate}</p>
                    <p>Phone: {card?.phone}</p>
                    <p>Email: {card?.email}</p>
                </div>
                <div className="bg-white p-4 rounded-3xl w-full lg:w-1/2">
                    <p className="font-Kanit text-2xl font-bold flex items-center gap-2">Address <span><MdLocationOn size={20} className="text-red-500" /></span></p>
                    <hr className="text-slate-400 my-3" />
                    <p>Street: {card?.street}</p>
                    <p>City: {card?.city}</p>
                    <p>State: {card?.state}</p>
                    <p>Postal Code: {card?.postalCode}</p>
                </div>
            </div>


            <div className="ml-8 lg:ml-10">
                <div className="font-Kanit font-bold text-lg">
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
                        <div key={index} className="flex flex-col gap-y-2 py-2 font-Kanit">
                            <p className="text-lg font-normal">{item.name}:</p>
                            <p className="bg-white border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MedicalComponent;