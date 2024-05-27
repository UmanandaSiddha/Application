import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";

interface ChartThreeState {
    series: number[];
}

const options: ApexOptions = {
    chart: {
        fontFamily: 'Satoshi, sans-serif',
        type: 'donut',
    },
    colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
    labels: ['Desktop', 'Tablet', 'Mobile', 'Unknown'],
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

const ChartStats = () => {
    return (
        <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span> Desktop </span>
                <span> 65% </span>
            </p>
        </div>
    )
}

const CardsChart = () => {

    const [state, setState] = useState<ChartThreeState>({
        series: [65, 34, 12, 56],
    });

    const handleReset = () => {
        setState((prevState) => ({
            ...prevState,
            series: [65, 34, 12, 56],
        }));
    };
    handleReset;

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
                <div className="flex w-full items-center">
                    <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
                    <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                        <span> Desktop </span>
                        <span> 65% </span>
                    </p>
                </div>
                <div className="flex w-full items-center">
                    <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]"></span>
                    <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                        <span> Tablet </span>
                        <span> 34% </span>
                    </p>
                </div>
                <div className="flex w-full items-center">
                    <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]"></span>
                    <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                        <span> Mobile </span>
                        <span> 45% </span>
                    </p>
                </div>
                <div className="flex w-full items-center">
                    <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#0FADCF]"></span>
                    <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                        <span> Unknown </span>
                        <span> 12% </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CardsChart;