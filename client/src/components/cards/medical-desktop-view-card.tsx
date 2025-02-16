import profilecard from '../../assets/extra/profile-card.svg';
import profileicon from '../../assets/extra/profile-icon.svg';

const MedicalDesktopViewCard = () => {
    return (
        <div className='bg-[#E5EFF3] p-9 h-full'>
            <div className="flex justify-between items-center p-10">
                <h1 className="font-bold text-2xl">Dashboard</h1>
            </div>

            <div className='flex gap-[32px] m-10'>
                <div className="relative h-fit w-fit ml-10 inline-block bg-white rounded-[16px] p-5 shadow-md">
                    <img src={profilecard} alt="Profile Card" />

                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                        <img src={profileicon} alt="Profile Icon" className="w-[92px] h-[92px]" />
                        <div className="mt-2 font-semibold text-lg">David Storm</div>
                    </div>

                    <div className="absolute bottom-5 left-5 w-full px-5">
                        <div className="grid grid-cols-2 gap-x-10 text-gray-500 text-sm font-semibold">
                            <div className="flex flex-col gap-2">
                                <span>Gender</span>
                                <span>Age</span>
                                <span>Language</span>
                                <span>Height</span>
                                <span>Date of Birth</span>
                                <span>Phone Number</span>
                            </div>
                            <div className="flex flex-col gap-2 text-black">
                                <span>Male</span>
                                <span>27</span>
                                <span>ENG</span>
                                <span>6.3</span>
                                <span>01/01/1997</span>
                                <span>+91 9876543219</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='bg-white p-9 h-fit w-[527px] rounded-[16px] shadow-md'>
                    <h2 className='text-[20px] font-bold'>Address</h2>
                    <p className='text-gray-600 mt-2'>Neo Apartments, Block A, 1802, Near Golf Course, Sector 76</p>
                    <p className='text-gray-600'>State - New Delhi</p>
                    <p className='text-gray-600'>Postal - 781005</p>
                    <div className='border-b-1 p-'>
                        <h2 className='text-[20px] font-bold mt-4'>Previous Surgeries</h2>
                        <p className='text-gray-600 mt-2 pb-2'>Nil</p>
                    </div>
                    <div className='border-b-1'>
                        <h2 className='text-[20px] font-bold mt-4'>Smoker</h2>
                        <p className='text-gray-600 mt-2 pb-2'>Nil</p>
                    </div>
                    <div className='border-b-1'>
                        <h2 className='text-[20px] font-bold mt-4'>Alcohol Consumption</h2>
                        <p className='text-gray-600 mt-2 pb-2'>Nil</p>
                    </div>
                    <div className='border-b-1'>
                        <h2 className='text-[20px] font-bold mt-4 '>Exercise Routine</h2>
                        <p className='text-gray-600 mt-2 pb-2'>In the morning</p>
                    </div>
                </div>

                <div className='flex flex-col gap-5'>
                    <div className="bg-white p-5 w-[332px] rounded-[16px] shadow-md">
                        <h2 className="text-[20px] font-bold">Chronic Medical Conditions</h2>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {['Diabetes', 'Lactose Intolerant', 'Protein Energy Heavy Malnutrition'].map(condition => (
                                <span key={condition} className="rounded-[5.44px] p-2 w-fit bg-[#E0EBFB] text-[#3567B0]">
                                    {condition}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-5 w-[332px] rounded-[16px] shadow-md">
                        <h2 className="text-[20px] font-bold">Current Medications</h2>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {['Diabetes', 'Lactose Intolerant', 'Protein Energy Heavy Malnutrition'].map(medication => (
                                <span key={medication} className="rounded-[5.44px] p-2 w-fit bg-[#E0EBFB] text-[#3567B0]">
                                    {medication}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-5 w-[332px] rounded-[16px] shadow-md">
                        <h2 className="text-[20px] font-bold">Dietary Preferences</h2>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {['Diabetes', 'Lactose Intolerant', 'Protein Energy Heavy Malnutrition'].map(diet => (
                                <span key={diet} className="rounded-[5.44px] p-2 w-fit bg-[#E0EBFB] text-[#3567B0]">
                                    {diet}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex gap-[32px] ml-20 '>
                <div className="bg-white w-[332px] p-5  rounded-[16px] shadow-md">
                    <h2 className="text-[20px] font-bold">Known Allergies</h2>
                    <div className="flex flex-wrap gap-3 mt-2">
                        {['Diabetes', 'Lactose Intolerant', 'Protein Energy Heavy Malnutrition'].map(allergy => (
                            <span key={allergy} className="rounded-[5.44px] p-2 w-fit bg-[#E0EBFB] text-[#3567B0]">
                                {allergy}
                            </span>
                        ))}
                    </div>
                </div>

                <div className='bg-white w-[520px] p-5 mx-10 rounded-[16px] shadow-md'>
                    <h2 className='text-[20px] font-bold'>SOS</h2>
                    <div className='flex w-[386px] gap-3  mt-3'>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className='shadow-2xl w-[118px] 
                                p-2 rounded-[16px] flex flex-col items-center'>
                                <span className='font-bold'>Partha Grag</span>
                                <span className='text-sm text-gray-500'>Cousin</span>
                                <button className='bg-[#E0EBFB] text-[#3567B0] px-4 py-1 mt-2 rounded'>Call</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col gap-5'>
                    <button className='border-[#5B83C2] border-2 text-[#5B83C2] font-medium px-5 py-2 rounded-full'>Health History →</button>
                    <button className='border-[#5B83C2] border-2 text-[#5B83C2] font-medium  px-5 py-2 rounded-full'>Insurance Info →</button>
                </div>
            </div>
        </div>
    )
}

export default MedicalDesktopViewCard;