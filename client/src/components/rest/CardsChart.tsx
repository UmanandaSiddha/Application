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
        fontFamily: "Satoshi, sans-serif",
        type: "donut",
    },
    colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF", "#5A9DF2", "#4F72D8"],
    labels: ["Botanical", "Individual", "Creator", "Animal", "Medical", "Remaining"],
    legend: {
        show: false,
        position: "bottom",
    },
    plotOptions: {
        pie: {
            donut: {
                size: "65%",
                background: "transparent",
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

const CardsChart = ({ stats, total = 0 }: { stats: CardStats; total: number }) => {
    const { botanical, individual, creator, animal, medical } = stats;
    const remaining = Math.max(0, total - (botanical + individual + creator + animal + medical));

    const [state, setState] = useState<ChartThreeState>({
        series: [botanical, individual, creator, animal, medical, remaining],
    });

    const statsArray = [
        ...Object.entries(stats).map(([key, value]) => ({ key, value })),
        { key: "remaining", value: remaining },
    ];

    useEffect(() => {
        const newSeries = [botanical, individual, creator, animal, medical, remaining].map((value) =>
            isNaN(value) || value < 0 ? 0 : value
        );
        setState((prevState) => ({
            ...prevState,
            series: newSeries,
        }));
    }, [botanical, individual, creator, animal, medical, remaining]);

    const typeStyles: Record<string, { backgroundColor: string }> = {
        botanical: { backgroundColor: "#3C50E0" },
        individual: { backgroundColor: "#6577F3" },
        animal: { backgroundColor: "#0FADCF" },
        creator: { backgroundColor: "#8FD0EF" },
        medical: { backgroundColor: "#5A9DF2" },
        remaining: { backgroundColor: "#4F72D8" },
        default: { backgroundColor: "#4F72D8" },
    };

    return (
        // <div className="rounded-md flex border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">

        //     <div className="mb-2 ">
        //         <div id="chartThree" className="mx-auto flex justify-center">
        //             <ReactApexChart options={options} series={state.series} type="donut" />
        //         </div>
        //     </div>

        //     <div>
        //         {statsArray.map((item, index) => {
        //             const styles = item.key && typeStyles[item.key] ? typeStyles[item.key] : typeStyles.default;

        //             return (
        //                 <div className="flex w-full items-center" key={index}>
        //                     <span
        //                         className="mr-2 block h-3 w-full max-w-3 rounded-full"
        //                         style={{ backgroundColor: styles.backgroundColor }}
        //                     ></span>
        //                     <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
        //                         <span className="capitalize"> {item.key} </span>
        //                         <span> {total > 0 ? ((item.value / total) * 100).toFixed(2) : 0}% </span>
        //                     </p>
        //                 </div>
        //             );
        //         })}
        //     </div>
        // </div>
        <ReactApexChart options={options} series={state.series} type="donut" />
    );
};

export default CardsChart;