import CardsChart from "@/components/rest/CardsChart";
import SideBar from "@/components/rest/sidebar";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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

    const { user } = useSelector(
        (state: RootState) => state.userReducer
    );

    return (
        <div className="flex flex-col lg:flex-row justify-center bg-gradient-to-br from-[#efe8fa] to-[#fcfafd] min-h-screen">
            <div className="w-full lg:w-1/4 lg:ml-36 p-4">
                <SideBar />
            </div>
            <div className="flex flex-col items-center lg:w-3/4 w-full p-4">
                <div className="text-center mb-8 hidden md:block">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold lg:pt-3">Dashboard</h1>
                    <h2 className="text-2xl md:text-3xl pt-6 text-teal-500 font-medium">
                        Welcome {user?.name}
                    </h2>
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-10 lg:pl-16 lg:space-x-2 items-center w-full">
                    <div className="md:w-[400px] mt-10">
                        <CardsChart stats={stats} total={20} />
                    </div>

                    <div className="flex flex-col mt-10 lg:mt-0">
                        <h1 className="text-xl md:text-2xl font-semibold">
                            Remaining Cards <span className="text-blue-500">20</span>
                        </h1>
                        <ul className="mt-4 text-sm md:text-base max-md:text-center">
                            <li className="mb-4">
                                <p>
                                    <span className="font-semibold text-lg md:text-xl">Medical:</span>{" "}
                                    <span className="font-medium">{stats.medical}</span>{" "}
                                    <span className="text-sm md:text-lg">cards</span>
                                </p>
                            </li>
                            <li className="mb-4">
                                <p>
                                    <span className="font-semibold text-lg md:text-xl">Individual:</span>{" "}
                                    <span className="font-medium">{stats.individual}</span>{" "}
                                    <span className="text-sm md:text-lg">cards</span>
                                </p>
                            </li>
                            <li className="mb-4">
                                <p>
                                    <span className="font-semibold text-lg md:text-xl">Botanical:</span>{" "}
                                    <span className="font-medium">{stats.botanical}</span>{" "}
                                    <span className="text-sm md:text-lg">cards</span>
                                </p>
                            </li>
                            <li className="mb-4">
                                <p>
                                    <span className="font-semibold text-lg md:text-xl">Animal:</span>{" "}
                                    <span className="font-medium">{stats.animal}</span>{" "}
                                    <span className="text-sm md:text-lg">cards</span>
                                </p>
                            </li>
                            <li className="mb-4">
                                <p>
                                    <span className="font-semibold text-lg md:text-xl">Creator:</span>{" "}
                                    <span className="font-medium">{stats.creator}</span>{" "}
                                    <span className="text-sm md:text-lg">cards</span>
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
