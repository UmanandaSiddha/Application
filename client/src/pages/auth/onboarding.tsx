import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";

const OnBoarding = () => {

    const navigate = useNavigate();
    const tabs = ["I am an Individual", "I am an Organisation", "I am a Donor"];
    const [activeTab, setActiveTab] = useState<string>();

    const handleNavigation = () => {
        if (activeTab === tabs[0]) {
            navigate("/register");
        } else if (activeTab === tabs[1]) {
            navigate("/org/register");
        } else if (activeTab === tabs[2]) {
            navigate("/donation");
        } else {
            toast.warning("Select a tab to navigate");
            return;
        }
    }

    return (
        <div className="pt-6 pb-12 h-screen bg-gradient-to-br from-[#efe8fa] to-[#fcfafd]">
            <div className="w-[95%] md:w-[80%] lg:w-[70%] mx-auto mt-2 rounded-lg bg-white shadow-xl">
                <div className="p-4 pt-4 sm:pt-6 md:pt-8 mx-auto w-full md:w-[70%] lg:w-[65%]">
                    <h1 className="text-2xl text-center sm:text-3xl md:text-4xl lg:text-4xl  md:text-center font-bold">
                        Who are you?
                    </h1>
                    <p className="text-sm text-center sm:text-lg mt-4 leading-tight md:text-center text-slate-500">
                        To assist you in streamlining the process for achieving your objective
                    </p>
                </div>
                <div className="p-4 pb-10 sm:pb-16 md:pb-20 flex flex-col justify-center items-center gap-4">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full sm:w-[70%] md:w-[60%] lg:w-[55%] ${activeTab === tab
                                ? 'bg-purple-500 text-white'
                                : 'bg-purple-200 hover:bg-purple-500 hover:text-white text-purple-700'
                                } border border-purple-200 font-semibold py-3 sm:py-4 rounded-lg text-lg sm:text-xl`}
                        >
                            {tab}
                        </button>
                    ))}
                    <button
                        onClick={() => handleNavigation()}
                        className="w-full sm:w-[70%] md:w-[60%] lg:w-[55%] border-2 border-black text-black hover:text-white hover:bg-black font-semibold py-3 sm:py-4 rounded-lg text-lg sm:text-xl"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OnBoarding;