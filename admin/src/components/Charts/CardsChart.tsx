import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";

interface ChartThreeState {
    series: number[];
}

interface CardStats {
    botanical: number;
    individual: number;
    creator: number;
    medical: number;
    animal: number;
}

const options: ApexOptions = {
    chart: {
        fontFamily: 'Satoshi, sans-serif',
        type: 'donut',
    },
    colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF', '#5A9DF2', '#4F72D8'],
    labels: ['Botanical', 'Individual', 'Creator', 'Animal', 'Medical', 'Remaining'],
    legend: {
        show: false,
        position: 'bottom',
    },

    plotOptions: {
        pie: {
            donut: {
                size: '65%',
                background: 'transparent',
            },
        },
    },
    dataLabels: {
        enabled: false,
    },
    responsive: [
        {
            breakpoint: 2600,
            options: {
                chart: {
                    width: 380,
                },
            },
        },
        {
            breakpoint: 640,
            options: {
                chart: {
                    width: 200,
                },
            },
        },
    ],
};

const CardsChart = ({ stats, total = 0 }: { stats: CardStats, total: number }) => {

    const { botanical, individual, creator, animal, medical } = stats;
    const remaining = total - (botanical + individual + creator + animal + medical);

    const [state, setState] = useState<ChartThreeState>({
        series: [12, 13, 56, 34, 18, 28],
    });

    const statsArray = [
        ...Object.entries(stats).map(([key, value]) => ({ key, value })),
        { key: 'remaining', value: remaining }
    ];

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            series: [botanical, individual, creator, animal, medical, remaining],
        }));
    }, [botanical, individual, creator, animal, medical, remaining]);

    return (
        <div className="rounded-md border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
            <h5 className="text-xl font-semibold text-black dark:text-white">
                User Cards
            </h5>

            <div className="mb-2">
                <div id="chartThree" className="mx-auto flex justify-center">
                    <ReactApexChart
                        options={options}
                        series={state.series}
                        type="donut"
                    />
                </div>
            </div>

            <div>
                {statsArray.map((item, index) => {

                    const typeStyles: Record<string, { backgroundColor: string }> = {
                        botanical: { backgroundColor: "bg-[#3C50E0]" },
                        individual: { backgroundColor: "bg-[#6577F3]" },
                        animal: { backgroundColor: "bg-[#0FADCF]" },
                        creator: { backgroundColor: "bg-[#8FD0EF]" },
                        medical: { backgroundColor: "bg-[#5A9DF2]" },
                        remaining: { backgroundColor: "bg-[#4F72D8]" },
                        default: { backgroundColor: "bg-[#4F72D8]" }
                    };

                    const styles = item.key && typeStyles[item.key] ? typeStyles[item.key] : typeStyles.default;

                    return (
                        <div className="flex w-full items-center" key={index}>
                            <span className={`mr-2 block h-3 w-full max-w-3 rounded-full ${styles.backgroundColor}`}></span>
                            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                                <span className="capitalize"> {item.key} </span>
                                <span> {(item.value / total) * 100}% </span>
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CardsChart;