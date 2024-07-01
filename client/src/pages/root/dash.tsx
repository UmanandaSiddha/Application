import SideBar from "@/components/rest/sidebar";
import { MdQrCodeScanner } from "react-icons/md";

const Dashboard = () => {
    return (
        <div className="flex justify-center">
            <div className="flex flex-row w-[80%] md:w-[90%] lg:w-[80%] md:space-x-4 lg:space-x-4">
                <div className="basis-full md:basis-1/4 lg:basis-1/4 lg:block xl:block">
                    <SideBar />
                </div>
                <div className="basis-3/4 hidden md:flex justify-center items-center lg:max-h-screen">
                    <div className="flex flex-col justify-center items-center">
                        <MdQrCodeScanner className="w-[10rem] h-[10rem] text-slate-400" />
                        <div className="w-[100%] flex justify-center items-center font-Kanit text-slate-400">
                            <p className="">Click on any five</p>
                        </div>
                        <div className="w-[100%] flex justify-center items-center font-Kanit text-slate-400">
                            <p className="">options on the left to</p>
                        </div>
                        <div className="w-[100%] flex justify-center items-center font-Kanit text-slate-400">
                            <p className="">view your VCards.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
