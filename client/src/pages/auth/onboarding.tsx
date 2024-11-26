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
        <div className="w-[80%] lg:w-[70%] mx-auto mt-36 sm:mt-16 md:mt-24 rounded-2xl shadow-[-7px_-17px_52px_-6px_rgba(0,_0,_0,_0.1)] ">
            <div className="p-4 pt-10 sm:pt-16 md:pt-20 mx-auto  w-full md:w-[70%] lg:w-[65%]">
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
                            ? 'bg-indigo-400 text-white'
                            : 'bg-blue-50 hover:bg-indigo-400 hover:text-white text-indigo-400'
                            } border border-indigo-200 font-semibold py-3 sm:py-4 rounded-lg text-lg sm:text-xl`}
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

    )
}

export default OnBoarding;