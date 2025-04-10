import React, { useEffect, useState, useCallback } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { getCryptoData } from "../utility/api";
import PageSwitch from "./PageSwitchCard";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CryptoLineCharts: React.FC = () => {
    const [cryptoData, setCryptoData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const itemsPerPage = 4; // Display 4 charts per page

    // Sample labels for x-axis (timestamps)
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

    // Colors for different crypto lines
    const chartColors = [
        { border: "rgb(255, 99, 132)", background: "rgba(255, 99, 132, 0.5)" },
        { border: "rgb(53, 162, 235)", background: "rgba(53, 162, 235, 0.5)" },
        { border: "rgb(75, 192, 192)", background: "rgba(75, 192, 192, 0.5)" },
        { border: "rgb(255, 206, 86)", background: "rgba(255, 206, 86, 0.5)" }
    ];

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getCryptoData();
            setCryptoData(data);
        } catch (error) {
            console.error("Failed to fetch crypto data for charts", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Generate random data for demonstration
    const generateChartData = (crypto: any) => {
        // In a real app, you would use historical data from an API
        return {
            labels,
            datasets: [
                {
                    label: crypto.name,
                    data: Array.from({ length: 7 }, () => Math.floor(Math.random() * (crypto.current_price * 1.2 - crypto.current_price * 0.8) + crypto.current_price * 0.8)),
                    borderColor: chartColors[Math.floor(Math.random() * chartColors.length)].border,
                    backgroundColor: chartColors[Math.floor(Math.random() * chartColors.length)].background,
                    tension: 0.4,
                },
            ],
        };
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-zinc-200">Loading charts...</div>;
    }

    return (
        <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-6 text-zinc-200">Cryptocurrency Price Trends</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cryptoData.slice(currentIndex, currentIndex + itemsPerPage).map((crypto) => (
                    <div key={crypto.id} className="bg-[#282740] p-4 rounded-lg shadow-lg">
                        <h3 className="text-lg font-medium text-zinc-200 mb-2">{crypto.name}</h3>
                        <Line options={options} data={generateChartData(crypto)} />
                    </div>
                ))}
            </div>

            {cryptoData.length > 0 && (
                <div className="mt-6">
                    <PageSwitch
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        totalItems={cryptoData.length}
                        itemsPerPage={itemsPerPage}
                    />
                </div>
            )}
        </div>
    );
};

export default CryptoLineCharts;