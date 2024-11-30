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

    useEffect(() => {
        const newSeries = [botanical, individual, creator, animal, medical, remaining].map((value) =>
            isNaN(value) || value < 0 ? 0 : value
        );
        setState((prevState) => ({
            ...prevState,
            series: newSeries,
        }));
    }, [botanical, individual, creator, animal, medical, remaining]);

    return (
        <ReactApexChart options={options} series={state.series} type="donut" />
    );
};

export default CardsChart;