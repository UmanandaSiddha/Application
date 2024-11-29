import CardsChart from "@/components/rest/CardsChart";
import SideBar from "@/components/rest/sidebar";
import { useEffect, useState } from "react";

const Dashboard = () => {

    const [stats, setStats] = useState({
        botanical: 2,
        individual: 2,
        creator: 1,
        medical: 1,
        animal: 3,
    });

    useEffect(() => {
        setStats({ ...stats, creator: 2 });
    }, []);

    return (
        <div className="flex justify-center bg-white">
            <div className="flex flex-row w-[80%] md:w-[90%] lg:w-[80%] md:space-x-4 lg:space-x-4">
                <div className="basis-full md:basis-1/4 lg:basis-1/4 lg:block xl:block">
                    <SideBar />
                </div>
                <div className="basis-3/4 hidden md:flex justify-center items-center lg:max-h-screen">
                <CardsChart stats={stats} total={20} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
