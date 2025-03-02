import { MedicalData } from "@/types/type";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useState } from "react";

interface PropTypes {
    cardData: MedicalData;
}

const MedicalViewCard = ({ cardData }: PropTypes) => {
    const data = {
        profile: [
            {
                label: "Gender",
                value: cardData.gender || ""
            }, {
                label: "Age",
                value: cardData.age || ""
            }, {
                label: "Height",
                value: cardData.height || ""
            }, {
                label: "Weight",
                value: cardData.weight || ""
            }, {
                label: "Blood Type",
                value: cardData.blood || ""
            }, {
                label: "Date of Birth",
                value: cardData.dateOfBirth || ""
            }, {
                label: "Phone Number",
                value: cardData.phone || ""
            },
        ],
        address: {
            line1: `${cardData.street || ""} ${cardData.city || ""}`,
            state: cardData.state || "",
            postal_code: cardData.postalCode || ""
        },
        usual: [
            {
                name: "Previous Surgeries",
                value: cardData.previousSurgeries || ""
            },
            {
                name: "Smoker",
                value: cardData.smoker || ""
            },
            {
                name: "Alcohol Consumption",
                value: cardData.alcohol || ""
            },
            {
                name: "Exercise Routine",
                value: cardData.exercise === "Other" ? cardData.exercise_Other : cardData.exercise || ""
            },
            {
                name: "Dietry Preferences",
                value: cardData.diet === "Other" ? cardData.diet_Other : cardData.diet || ""
            },
            {
                name: "Current Medication",
                value: cardData.currentMedication || ""
            }
        ],
        contacts: [
            {
                name: cardData.emergencyName,
                relation: cardData.emergencyRelation,
                phone: cardData.emergencyPhone,
                action: "Call"
            },
        ],
        multiselect: [
            {
                name: "Known Allergies",
                data: cardData.allergyHistory?.split(",").map(item => item.trim()) || []
            },
            {
                name: "Mental Health",
                data: cardData.mentalCondition?.split(",").map(item => item.trim()) || []
            },
            {
                name: "Routine Vaccinations",
                data: cardData.vaccinationHistory?.split(",").map(item => item.trim()) || []
            },
            {
                name: "Chronic Conditions",
                data: cardData.chronicHistory?.split(",").map(item => item.trim()) || []
            }
        ],
        actions: [
            {
                name: "Insurance Info",
                data: [
                    {
                        label: "Insurance Provider",
                        value: cardData.insuranceProvider || ""
                    }, {
                        label: "Policy Number",
                        value: cardData.insurancePolicyNumber || ""
                    }, {
                        label: "Group Number",
                        value: cardData.insuranceGrpNumber || ""
                    }
                ]
            }
        ],
    };

    const [clicked, setClicked] = useState(false);

    return (
        <div className='w-full md:w-[50%] lg:w-[30%] mx-auto px-6'>
            <div className="mt-4">
                {data.profile.map((dat, index) => (
                    <div key={index} className='flex flex-wrap items-center gap-2'>
                        <p className='text-md text-[#454545] font-semibold whitespace-nowrap'>{dat.label} :</p>
                        <p className='text-md text-[#2E2E2E] whitespace-nowrap'>{dat.value ? dat.value : "----------"}</p>
                    </div>
                ))}
            </div>
            <div className="mt-2">
                <h2 className="text-[#2E2E2E] text-2xl font-semibold">Address</h2>
                <div>
                    <p className="text-[#555555]">{data.address.line1}</p>
                    <p className="text-[#4C4C4C]">State - {data.address.state}</p>
                    <p className="text-[#4C4C4C]">Postal -{data.address.postal_code}</p>
                </div>
            </div>
            <div className="">
                {data.usual.map((data, index) => (
                    <div key={index} className="mt-4">
                        <h2 className="text-[#2E2E2E] text-2xl font-semibold">{data.name}</h2>
                        <p className="text-[#555555]">{data.value}</p>
                        <hr className="border mt-1" />
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <h2 className="text-[#2E2E2E] text-2xl font-semibold">SOS</h2>
                <div className="flex gap-4 overflow-auto select-none hide-scrollbar">
                    {data.contacts.map((data, index) => (
                        <div key={index} className="flex flex-col justify-center items-center w-[200px] gap-1 py-2 px-5 bg-red-100 border rounded-2xl">
                            <p className="text-[#555555] text-lg font-semibold whitespace-nowrap">{data.name}</p>
                            <p className="text-[#4C4C4C]">{data.relation}</p>
                            <a href={`tel:${data.phone}`} className="bg-blue-100 text-center text-blue-700 text-lg font-semibold w-full py-1 rounded-md">{data.action}</a>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4">
                {data.multiselect.map((dat, index) => (
                    <div key={index} className="py-2">
                        <h1 className="text-[#2E2E2E] text-2xl font-semibold">{dat.name}</h1>
                        <div className="flex flex-wrap justify-start items-center gap-2">
                            {dat.data.map((dax, i) => (
                                <div key={i} className="px-3 py-2 rounded-md bg-blue-100">
                                    <p className="text-blue-600 font-normal">{dax}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                {data.actions.map((action, index) => (
                    <div key={index}>
                        <div
                            onClick={() => setClicked(prev => !prev)}
                            className="mb-3 flex justify-between items-center bg-white border-2 shadow-sm py-3 px-5 rounded-full border-blue-600 w-full"
                        >
                            <p className="text-blue-600 text-xl font-semibold">{action.name}</p>
                            {/* <ArrowRight size={24} className="text-blue-600 text-xl font-semibold" /> */}
                            {clicked ? (
                                <ArrowDown size={24} className="text-blue-600 text-xl font-semibold" />
                            ) : (
                                <ArrowRight size={24} className="text-blue-600 text-xl font-semibold" />
                            )}
                        </div>
                        {clicked && (
                            <div className="bg-white px-4 py-2 rounded-sm">
                                {action.data.map((action, index) => (
                                    <div key={index} className="flex flex-wrap items-center gap-2">
                                        <p className='text-lg text-[#454545] font-semibold whitespace-nowrap'>{action.label} :</p>
                                        <p className='text-lg text-[#2E2E2E] whitespace-nowrap'>{action.value ? action.value : "----------"}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MedicalViewCard;