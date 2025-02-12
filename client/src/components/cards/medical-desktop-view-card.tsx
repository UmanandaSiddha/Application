import { MedicalViewCardBackgroundDesktop } from "@/constants/cards/background";

const MedicalDesktopViewCard = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <div className="mx-4 sm:mx-16">
                <h1 className="text-3xl mt-14 md:mt-5 font-semibold">Dashboard</h1>
                <div className="w-full flex justify-center items-center gap-4 bg-red-100">
                    <div className="w-[27%] bg-white">
                        <img src={MedicalViewCardBackgroundDesktop} className="w-full h-auto" alt="" />
                    </div>
                    <div className="w-[42%] bg-white">
                        hiii
                    </div>
                    <div className="w-[27%] bg-white">
                        new
                    </div>
                </div>
                {/* <div className="bg-white w-[332px] p-5 mx-20 rounded-[8px] ">
                    <h2 className="text-[20px] font-bold mt-2">Known Allergies</h2>
                    <div className="flex flex-wrap gap-3 mt-2">
                        <span className=" rounded-[5.44px] p-2 w-fit bg-[#E0EBFB] text-[#3567B0] flex items-center">
                            Diabetes
                        </span>
                        <span className=" rounded-[5.44px] p-2 w-fit bg-[#E0EBFB] text-[#3567B0] flex items-center">
                            Lactose Intolerant
                        </span>
                        <span className=" rounded-[5.44px] p-2 w-fit bg-[#E0EBFB] text-[#3567B0] flex items-center">
                            Protein-Energy Malnutrition
                        </span>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default MedicalDesktopViewCard;