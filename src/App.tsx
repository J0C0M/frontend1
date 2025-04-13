import React, { useEffect, useState, useCallback } from "react";
import { getCryptoData } from "./utility/api";
import CryptoCardComponent from "./components/CryptoCardComponent.tsx";
import SearchBar from "./components/SearchBarComponent.tsx";
import PageSwitch from "./components/PageSwitchComponent.tsx";
import DonutCard from "./components/DonutChartCardComponent.tsx";
import RefreshButton from "./components/RefreshComponent";
import CryptoLine from "./components/LineChartComponent";
import FavoriteCoins from "./components/FavoriteCoinsComponent.tsx";
import CryptoDetail from "./components/CryptoCoinDetailComponent.tsx";

// Define the shape of cryptocurrency data
interface Crypto {
    id: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
}

const App: React.FC = () => {
    // State management for the application
    const [cryptoData, setCryptoData] = useState<Crypto[]>([]); // Store all crypto data
    const [loading, setLoading] = useState<boolean>(true); // Track initial loading state
    const [refreshing, setRefreshing] = useState<boolean>(false); // Track refresh state
    const [filteredData, setFilteredData] = useState<Crypto[]>([]); // Store filtered crypto data
    const [currentIndex, setCurrentIndex] = useState<number>(0); // Current page index
    const [favorites, setFavorites] = useState<string[]>([]); // Store favorite crypto IDs
    const [selectedCryptoId, setSelectedCryptoId] = useState<string | null>(null); // Track selected crypto for detail view
    const itemsPerPage = 5; // Number of cryptocurrencies to display per page

    // Load favorites from localStorage on app start
    useEffect(() => {
        const savedFavorites = localStorage.getItem("cryptoFavorites");
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Save favorites to localStorage when they change
    useEffect(() => {
        localStorage.setItem("cryptoFavorites", JSON.stringify(favorites));
    }, [favorites]);

    // Fetch cryptocurrency data from API
    const fetchData = useCallback(async (isRefresh = false) => {
        try {
            // Set appropriate loading state based on whether it's initial load or refresh
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await getCryptoData();
            setCryptoData(data);
            setFilteredData(data); // Initialize filtered data with all data
        } catch {
            console.error("Failed to fetch crypto data");
        } finally {
            // Reset loading states when done
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle search functionality
    const handleSearch = (query: string) => {
        const lowerCaseQuery = query.toLowerCase();
        const filtered = cryptoData.filter((crypto) =>
            crypto.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredData(filtered);
        setCurrentIndex(0); // Reset to first page of results
    };

    // Handle refresh button click
    const handleRefresh = () => {
        fetchData(true);
    };

    // Toggle a cryptocurrency as favorite/unfavorite
    const handleToggleFavorite = (id: string) => {
        setFavorites(prevFavorites => {
            if (prevFavorites.includes(id)) {
                return prevFavorites.filter(favId => favId !== id);
            } else {
                return [...prevFavorites, id];
            }
        });
    };

    // Handle cryptocurrency selection for detail view
    const handleCryptoSelect = (id: string) => {
        setSelectedCryptoId(id);
    };

    // Navigate back to dashboard from detail view
    const handleBackToDashboard = () => {
        setSelectedCryptoId(null);
    };

    // If a crypto is selected, show the detail view
    if (selectedCryptoId) {
        return (
            <CryptoDetail
                cryptoId={selectedCryptoId}
                onBack={handleBackToDashboard}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(selectedCryptoId)}
            />
        );
    }

    // Otherwise show the dashboard
    return (
        <div className="min-h-screen p-6">
            <div className="pt-6">
                <CryptoLine />
            </div>
            <div className="flex flex-wrap gap-6 mb-6 ">
                <div className="py-6 ">
                    <DonutCard />
                </div>
                <div className="py-6 w-[66%]">
                    <FavoriteCoins
                        favorites={favorites}
                        cryptoData={cryptoData}
                        onToggleFavorite={handleToggleFavorite}
                        onCryptoSelect={handleCryptoSelect}
                    />
                </div>
            </div>
            <div className="flex gap-6 items-center mb-6">
                <h1 className="text-3xl font-bold text-zinc-200">Cryptocurrency Prices</h1>
                <RefreshButton onRefresh={handleRefresh} isLoading={refreshing} />
            </div>
            <SearchBar onSearch={handleSearch} onCancel={() => { setFilteredData(cryptoData); setCurrentIndex(0); }} />
            {loading ? (
                <p className="text-center text-zinc-200 mt-8">Loading...</p>
            ) : (
                <div className="flex flex-col gap-4 mt-6">
                    {filteredData.slice(currentIndex, currentIndex + itemsPerPage).map((crypto) => (
                        <CryptoCardComponent
                            key={crypto.id}
                            id={crypto.id}
                            name={crypto.name}
                            image={crypto.image}
                            price={crypto.current_price}
                            marketCap={crypto.market_cap}
                            isFavorite={favorites.includes(crypto.id)}
                            onToggleFavorite={handleToggleFavorite}
                            onCryptoSelect={handleCryptoSelect}
                        />
                    ))}
                    {filteredData.length === 0 && (
                        <p className="text-center text-zinc-200">No cryptocurrencies found matching your search.</p>
                    )}
                </div>
            )}
            <PageSwitch
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                totalItems={filteredData.length}
                itemsPerPage={itemsPerPage}
            />
        </div>
    );
};

export default App;