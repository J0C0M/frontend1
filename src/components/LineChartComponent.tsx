import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { getCryptoData } from "../utility/api";
import PageSwitch from "./PageSwitchComponent.tsx";

// Register Chart.js components needed for line charts
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * Component that displays line charts for cryptocurrency price history
 * Includes pagination to show multiple charts
 */
const CryptoLineCharts: React.FC = () => {
    // State to store cryptocurrency data fetched from API
    const [cryptoData, setCryptoData] = useState<any[]>([]);
    // Loading state to show loading indicator
    const [loading, setLoading] = useState<boolean>(true);
    // State to track current page index for pagination
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    // Number of charts to display per page
    const itemsPerPage = 4;

    // Colors for charts - simplified color palette
    const chartColors = [
        { border: "rgb(15,255,0)", background: "rgb(64,178,56)" }, // teal
        { border: "rgb(0,23,255)", background: "rgb(16,13,83)" }, // indigo
        { border: "rgb(255,104,0)", background: "rgba(249, 115, 22, 0.2)" }, // orange
        { border: "rgb(255,0,125)", background: "rgba(236, 72, 153, 0.2)" }  // pink
    ];

    // Fetch crypto data when component mounts
    useEffect(() => {
        /**
         * Fetches cryptocurrency data and generates mock price history
         */
        async function loadData() {
            try {
                setLoading(true);
                // Using the API function from api.ts as requested
                const data = await getCryptoData();

                // Generate price history only once and attach it to the data
                const dataWithHistory = data.map((crypto: { current_price: number; id: string; }) => {
                    return {
                        ...crypto,
                        priceHistory: generatePriceHistory(crypto.current_price, crypto.id)
                    };
                });

                setCryptoData(dataWithHistory);
            } catch (error) {
                console.error("Failed to fetch crypto data", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const generatePriceHistory = (basePrice: number, cryptoId: string) => {
        const priceHistory = [];
        const days = 14;
        const today = new Date();

        // Use crypto ID to create a consistent seed for randomness
        const seed = Array.from(cryptoId).reduce((sum, char) => sum + char.charCodeAt(0), 0);

        let previousPrice = basePrice;

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);

            // Create deterministic price movement using the seed and day
            const daySeed = seed + i * 137;
            const pseudoRandom = Math.sin(daySeed) * 10000;
            const normalizedRandom = (pseudoRandom - Math.floor(pseudoRandom)) * 2 - 1;

            // Smaller volatility for more realistic price movements
            const volatility = 0.02;
            const priceChange = previousPrice * normalizedRandom * volatility;

            // If it's the last day, ensure it equals the current price exactly
            let price;
            if (i === 0) {
                price = basePrice;
            } else {
                price = previousPrice + priceChange;
                previousPrice = price;
            }

            priceHistory.push({
                date: date,
                price: price
            });
        }

        return priceHistory;
    };

    // Chart.js configuration options with improved tooltips
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(30, 30, 45, 0.8)',
                titleColor: 'rgba(255, 255, 255, 0.8)',
                bodyColor: 'rgba(255, 255, 255, 0.8)',
                padding: 10,
                displayColors: false,
                callbacks: {
                    title: function(tooltipItems: any) {
                        return tooltipItems[0].label;
                    },
                    label: function(context: any) {
                        return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    callback: function(value: any) {
                        return '$' + value.toFixed(2);
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false
                }
            },
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    maxRotation: 0
                },
                grid: {
                    display: false
                }
            }
        }
    };

    // Show loading indicator when data is being fetched
    if (loading) {
        return <div className="text-center py-8 text-zinc-200">Loading charts...</div>;
    }

    return (
        <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-6 text-zinc-200">Crypto Price Charts</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cryptoData.slice(currentIndex, currentIndex + itemsPerPage).map((crypto, index) => {
                    // Prepare chart data from the pre-generated history
                    const chartData = {
                        labels: crypto.priceHistory.map((item: {date: Date, price: number}) =>
                            item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        ),
                        datasets: [{
                            label: crypto.name,
                            data: crypto.priceHistory.map((item: {date: Date, price: number}) => item.price),
                            borderColor: chartColors[index % chartColors.length].border,
                            backgroundColor: chartColors[index % chartColors.length].background,
                            borderWidth: 2,
                            pointRadius: 2, // Small points visible on hover
                            pointHoverRadius: 6, // Larger points on hover
                            tension: 0.4
                        }]
                    };

                    return (
                        <div key={crypto.id} className=" p-4 shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-medium text-zinc-100">{crypto.name}</h3>
                                    <p className="text-sm text-zinc-400">{crypto.symbol.toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-zinc-100">${crypto.current_price.toFixed(2)}</p>
                                    <p className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                            <div className="h-48">
                                <Line options={options} data={chartData} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Display pagination controls if there are more items than can fit on a page */}
            {cryptoData.length > itemsPerPage && (
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