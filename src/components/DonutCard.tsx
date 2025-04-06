import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { getCryptoData } from "../utility/api"; // Updated import path

// Register necessary components for Chart.js v4
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart: React.FC = () => {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const data = await getCryptoData(); // Use the imported function

                if (data && Array.isArray(data)) {
                    setChartData({
                        datasets: [{
                            label: 'Market Cap',
                            data: data.slice(0, 10).map((coin) => coin.market_cap),
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)',
                                'rgb(255, 159, 64)',
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
                <p className="text-center text-zinc-200">Loading Chart...</p>
            )}
        </div>
    );
};

export default DoughnutChart;