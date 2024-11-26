import SideBar from "@/components/rest/sidebar";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, layouts } from 'chart.js';
import React, { useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

type DataSet = {
    label: string;
    data: (number | null)[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
};

type ChartData = {
    labels: string[];
    datasets: DataSet[];
};
const Dashboard = () => {
    const getDataWithGraySegment = (values: number[]): ChartData => {
        const total = 100;
        const sum = values.reduce((acc, value) => acc + value, 0);
        const remaining = total - sum;

        return {
            labels: ['Individual', 'Botany', 'Medical', 'Creator', 'Animal', 'Remaining'],
            datasets: [
                {
                    label: '',
                    data: [...values.map(value => value === 0 ? null : value), remaining],
                    backgroundColor: [
                        '#bfdcff',
                        '#bcf7d1',
                        '#478AFB',
                        '#a4f4fc',
                        '#ffcccc',
                        'rgba(201, 203, 207, 0.6)' // Gray color for the remaining part
                    ],
                    borderColor: [
                        '#bfdcff',
                        '#bcf7d1',
                        '#478AFB',
                        '#a4f4fc',
                        '#ffcccc',
                        'rgba(201, 203, 207, 1)' // Gray color for the border of the remaining part
                    ],
                    borderWidth: 1
                }
            ]
        };
    };

    const values: number[] = [4, 10, 10, 20, 24];
    const categories = ['Individual', 'Botany', 'Medical', 'Creator', 'Animal'];
    const [cardDetails, setCardDetails] = useState<{ category: string; count: number; message?: string }[]>([]);
    const data: ChartData = getDataWithGraySegment(values);
    const cardTracker = () => {
        const details = categories.map((category, index) => {
            const count = values[index];
            return {
                category,
                count,
                message:
                    count < 5
                        ? <>You have only {count} {category} cards left! . <br />Please buy a new plan to add more cards. </>
                        : undefined,
            };
        });

        setCardDetails(details); // Update state with the details
    };
    React.useEffect(() => {
        cardTracker();
    }, []);
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    boxWidth: 20,
                    padding: 15,
                    font: {
                        size: 14,
                        family: 'Arial'
                    },
                    color: '#333'
                },
            },
            tooltip: {
                enabled: true
            }
        },
        layout: {
            padding: {
                right: 50
            },
        },
    };

    return (
        <div className="flex flex-col lg:flex-row justify-center bg-gradient-to-br from-[#efe8fa] to-[#fcfafd] min-h-screen">
            <div className="w-full lg:w-1/4 lg:ml-36 p-4">
                <SideBar />
            </div>
            <div className="flex flex-col items-center lg:w-3/4 w-full p-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold lg:pt-3">Dashboard</h1>
                    <h2 className="text-2xl md:text-3xl pt-6 text-teal-500 font-medium">
                        Welcome Nilkamal Sarma
                    </h2>
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-10 lg:pl-16 lg:space-x-2 items-center w-full">
                    <div className="w-[400px] mt-10">
                        <Doughnut data={data} options={options} />
                    </div>

                    <div className="flex flex-col mt-10 lg:mt-0">
                        <h1 className="text-xl md:text-2xl font-bold">
                            Your Remaining <span className="text-blue-500">VCards</span>
                        </h1>
                        <ul className="mt-4 text-sm md:text-base">
                            {cardDetails.map((detail, index) => (
                                <li key={index} className="mb-4">
                                    <p>
                                        <span className="font-semibold text-lg md:text-xl">
                                            {detail.category}:
                                        </span>{" "}
                                        <span className="font-medium">{detail.count}</span>{" "}
                                        <span className="text-sm md:text-lg">cards</span>
                                    </p>
                                    {detail.message && (
                                        <p className="text-red-500 text-sm md:text-base">
                                            {detail.message}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="w-full text-center mt-10 font-Kanit text-slate-400">
                    <p className="text-sm md:text-lg">
                        Click on any Five options <br />
                        on the left to <br />
                        view your VCards.
                    </p>
                </div>
            </div>
        </div>

    );
};

export default Dashboard;
