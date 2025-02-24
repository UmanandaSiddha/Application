import { MedicalData } from '@/types/type';
import profilecard from '../../assets/extra/profile-card.svg';
import { MedicalCardIcon } from '@/constants/cards/icons';
import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

interface PropTypes {
    cardData: MedicalData;
}

const MedicalDesktopViewCard = ({ cardData }: PropTypes) => {

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
        <div className='bg-[#E5EFF3]'>
            <div className='w-full lg:w-[90%] mx-auto py-9 h-full'>
                <div className='w-full flex gap-6 justify-center'>
                    <div className='w-[30%]'>
                        <div className="w-full relative inline-block bg-white rounded-xl shadow-md">
                            <img src={profilecard} alt="Profile Card" className='w-full h-full' />

                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                                <img src={MedicalCardIcon} alt="Profile Icon" className="w-24 h-24 rounded-full" />
                                <div className="mt-2 font-semibold text-lg">{cardData.name}</div>
                            </div>

                            <div className="absolute bottom-5 left-5 w-full px-5">
                                {data.profile.map((dat, index) => (
                                    <div key={index} className='flex flex-wrap items-center gap-2'>
                                        <p className='text-md text-[#454545] font-semibold whitespace-nowrap'>{dat.label} :</p>
                                        <p className='text-md text-[#2E2E2E] whitespace-nowrap'>{dat.value ? dat.value : "----------"}</p>
                                    </div>
                                ))}
                                <div className="mt-1">
                                    <h2 className="text-[#2E2E2E] text-md font-semibold">Address :</h2>
                                    <div>
                                        <p className="text-[#555555] text-md">{data.address.line1} lorem10</p>
                                        <p className="text-[#4C4C4C] text-md">State - {data.address.state}</p>
                                        <p className="text-[#4C4C4C] text-md">Postal -{data.address.postal_code}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            {data.actions.map((action, index) => (
                                <div key={index}>
                                    <div
                                        onClick={() => setClicked(prev => !prev)}
                                        className="mb-3 flex justify-between items-center bg-white border-2 shadow-sm py-4 px-5 rounded-full border-blue-600 w-full"
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
                                        <div className="bg-white px-4 py-2 rounded-lg">
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

                    <div className='bg-white px-9 py-6 w-[40%] rounded-xl shadow-md'>
                        {data.usual.map((data, index) => (
                            <div key={index} className="mt-4">
                                <h2 className="text-[#2E2E2E] text-xl font-semibold">{data.name}</h2>
                                <p className="text-[#555555]">{data.value}</p>
                            </div>
                        ))}
                        <div className="mt-8">
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
                    </div>

                    <div className='flex flex-col w-[30%] gap-5'>
                        {data.multiselect.map((dat, index) => (
                            <div key={index} className="bg-white p-5 w-[332px] rounded-[16px] shadow-md">
                                <h2 className="text-[20px] font-bold">{dat.name}</h2>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {dat.data.map((dax, i) => (
                                        <div key={i} className="rounded-[5.44px] p-2 w-fit bg-[#E0EBFB] text-[#3567B0]">
                                            {dax}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MedicalDesktopViewCard;