import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { getCryptoData } from "../utility/api";

// Register necessary components for Chart.js
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

interface DonutCardProps {
    refreshKey?: number;
}

const DoughnutChart: React.FC<DonutCardProps> = ({ refreshKey = 0 }) => {
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCryptoData = async () => {
            setLoading(true);
            try {
                const data = await getCryptoData();

                if (data && Array.isArray(data)) {
                    // Get top 10 crypto coins
                    const topCoins = data.slice(0, 10);

                    setChartData({
                        labels: topCoins.map(coin => coin.name), // Voeg labels toe voor tooltips
                        datasets: [{
                            data: topCoins.map(coin => coin.market_cap),
                            backgroundColor: [
                                'rgb(255, 159, 64)',
                                'rgb(255, 99, 132)',
                                'rgb(144, 238, 144)',
                                'rgb(54, 162, 235)',
                                'rgb(75, 192, 192)',
                            ],
                            hoverOffset: 4
                        }]
                    });
                }
            } catch (error) {
                console.error("Error fetching crypto data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCryptoData();
    }, [refreshKey]);

    return (
        <div className="w-96 h-[445px] mx-auto p-4 shadow-lg">
            <h2 className="text-2xl font-bold text-zinc-200 mb-6 text-center">Top 10 Crypto Market Cap</h2>
            {loading ? (
                <p className="text-center text-zinc-200">Loading chart...</p>
            ) : chartData ? (
                <Doughnut
                    data={chartData}
                    options={{
                        plugins: {
                            legend: {
                                display: false
                                // hide the coin visibilty disable buttons
                            }
                        }
                    }}
                />
            ) : (
                <p className="text-center text-zinc-200">No data available</p>
            )}
        </div>
    );
};

export default DoughnutChart;