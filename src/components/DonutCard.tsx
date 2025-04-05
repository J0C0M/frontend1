import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { getCryptoData } from "./utility/api";


// Register necessary components for Chart.js v4
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart: React.FC = () => {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const response = await fetch(
                    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
                );
                const data = await response.json();

                if (data && Array.isArray(data)) {
                    setChartData({
                        labels: data.map((coin) => coin.name),
                        datasets: [{
                            label: 'My First Dataset',
                            data: data.map((coin) => coin.market_cap),
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)'
                            ],
                            hoverOffset: 4
                        }]
                    });
                }
            } catch (error) {
                console.error("Error fetching crypto data:", error);
            }
        };

        fetchCryptoData();
    }, []);

    return (
        <div className="w-96 mx-auto mt-6 bg-[#282740] p-4 rounded-lg">
            <h2 className="text-zinc-200 text-center text-xl mb-4">Top 10 Crypto Market Cap</h2>
            {chartData ? (
                <Doughnut data={chartData} />
            ) : (
                <p className="text-center text-zinc200">Loading Chart...</p>
            )}
        </div>
    );
};

export default DoughnutChart;
