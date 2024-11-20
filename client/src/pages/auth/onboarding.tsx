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
        <div className="w-full mt-16">
            <div className="p-4 w-full mx-auto md:w-[50%] lg:w-[40%]">
                <h1 className="text-3xl lg:text-4xl text-left lg:text-center font-bold">Who are you?</h1>
                <p className="text-lg mt-4 leading-tight text-left lg:text-center text-slate-500">To assist you in streamlining the process for achieving your objective</p>
            </div>
            <div className="p-4 flex flex-col justify-center items-center gap-4">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full md:w-[50%] lg:w-[40%] ${activeTab === tab ? "bg-indigo-400 text-white" : "bg-blue-50 hover:bg-indigo-400 hover:text-white text-indigo-400"} border border-indigo-200 font-semibold py-4 rounded-lg text-xl`}
                    >
                        {tab}
                    </button>
                ))}
                <button onClick={() => handleNavigation()} className="w-full md:w-[50%] lg:w-[40%] border-2 border-black text-black hover:text-white hover:bg-black font-semibold py-4 rounded-lg text-xl">
                    Continue
                </button>
            </div>
        </div>
    )
}

export default OnBoarding;