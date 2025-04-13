import React, { useEffect, useState, useCallback } from "react";
import { getCryptoData } from "./utility/api";
import CryptoCard from "./components/CryptoCard";
import SearchBar from "./components/SearchBarCard";
import PageSwitch from "./components/PageSwitchCard";
import DonutCard from "./components/DonutCard";
import RefreshButton from "./components/RefreshComponent";
import CryptoLine from "./components/LineChartComponent";
import FavoriteCoins from "./components/FavoriteCoinsComponent.tsx";
import CryptoDetail from "./components/CryptoCoinDetailComponent.tsx";

interface Crypto {
    id: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
}

const App: React.FC = () => {
    const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [filteredData, setFilteredData] = useState<Crypto[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [selectedCryptoId, setSelectedCryptoId] = useState<string | null>(null);
    const itemsPerPage = 5;

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

    const fetchData = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await getCryptoData();
            setCryptoData(data);
            setFilteredData(data);
        } catch {
            console.error("Failed to fetch crypto data");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearch = (query: string) => {
        const lowerCaseQuery = query.toLowerCase();
        const filtered = cryptoData.filter((crypto) =>
            crypto.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredData(filtered);
        setCurrentIndex(0);
    };

    const handleRefresh = () => {
        fetchData(true);
    };

    const handleToggleFavorite = (id: string) => {
        setFavorites(prevFavorites => {
            if (prevFavorites.includes(id)) {
                return prevFavorites.filter(favId => favId !== id);
            } else {
                return [...prevFavorites, id];
            }
        });
    };

    const handleCryptoSelect = (id: string) => {
        setSelectedCryptoId(id);
    };

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
                        <CryptoCard
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