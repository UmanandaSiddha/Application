import { ArrowRight } from "lucide-react";


const MedicalViewCard = () => {
    const data = {
        profile: [
            {
                label: "Gender",
                value: "Male"
            }, {
                label: "Age",
                value: 27
            }, {
                label: "Language",
                value: "ENG"
            }, {
                label: "Height",
                value: 6.3
            }, {
                label: "Date of Birth",
                value: "01/01/1997"
            }, {
                label: "Phone Number",
                value: "+91 9876543219"
            }
        ],
        address: {
            line1: "Neo Apartments, Block A, 1802, Near Golf Course, Sector 76",
            state: "New Delhi",
            postal_code: "781005"
        },
        usual: [
            {
                name: "Previous Surgeries",
                value: "Nil"
            },
            {
                name: "Smoker",
                value: "Nil"
            },
            {
                name: "Alcohol Consumption",
                value: "Nil"
            },
            {
                name: "Exercise Routine",
                value: "Nil"
            }
        ],
        contacts: [
            {
                name: "Partha Grag",
                relation: "Cousin",
                action: "Call"
            },
            {
                name: "Partha Grag",
                relation: "Cousin",
                action: "Call"
            },
            {
                name: "Partha Grag",
                relation: "Cousin",
                action: "Call"
            },
            {
                name: "Partha Grag",
                relation: "Cousin",
                action: "Call"
            },
            {
                name: "Partha Grag",
                relation: "Cousin",
                action: "Call"
            },
            {
                name: "Partha Grag",
                relation: "Cousin",
                action: "Call"
            },
            {
                name: "Partha Grag",
                relation: "Cousin",
                action: "Call"
            },
            {
                name: "Partha Grag",
                relation: "Cousin",
                action: "Call"
            },
            {
                name: "Partha Grag",
                relation: "Cousin",
                action: "Call"
            }
        ],
        multiselect: [
            {
                name: "Current Medications",
                data: ["Diabetes", "Lactose Intolerant", "Protein Energy", "Heavy", "Malnutrition"]
            },
            {
                name: "Previous Surgeries",
                data: ["Diabetes", "Lactose Intolerant", "Protein Energy Heavy Malnutrition"]
            },
            {
                name: "Chronic Conditions",
                data: ["Diabetes", "Lactose Intolerant", "Protein Energy", "Heavy Malnutrition"]
            }
        ],
        actions: [
            {
                name: "Health History",
                data: [
                    {
                        label: "Health History",
                        value: ""
                    }
                ]
            },
            {
                name: "Insurance Info",
                data: [
                    {
                        label: "Health History",
                        value: ""
                    }
                ]
            }
        ],
    };

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
                        <div key={index} className="flex flex-col justify-center items-center gap-1 py-2 px-5 bg-red-100 border rounded-2xl">
                            <p className="text-[#555555] text-lg font-semibold whitespace-nowrap">{data.name}</p>
                            <p className="text-[#4C4C4C]">{data.relation}</p>
                            <button className="bg-blue-100 text-blue-700 text-lg font-semibold w-full py-1 rounded-md">{data.action}</button>
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
                    <div key={index} className="mb-3 flex justify-between items-center bg-white border-2 shadow-sm py-3 px-5 rounded-full border-blue-600 w-full">
                        <p className="text-blue-600 text-xl font-semibold">{action.name}</p>
                        <ArrowRight size={24} className="text-blue-600 text-xl font-semibold" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MedicalViewCard;