import React, { useEffect, useState } from "react";
import { getCryptoData } from "./utility/api";
import CryptoCard from "./components/CryptoCard";
import SearchBar from "./components/SearchBarCard";
import PageSwitch from "./components/PageSwitchCard.tsx";

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
    const [filteredData, setFilteredData] = useState<Crypto[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCryptoData();
                setCryptoData(data);
                setFilteredData(data);
            } catch {
                console.error("Failed to fetch crypto data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (query: string) => {
        const lowerCaseQuery = query.toLowerCase();
        const filtered = cryptoData.filter((crypto) =>
            crypto.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredData(filtered);
        setCurrentIndex(0);
    };

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-3xl font-bold text-zinc-200 mb-6">Cryptocurrency Prices</h1>
            <SearchBar onSearch={handleSearch} onCancel={() => { setFilteredData(cryptoData); setCurrentIndex(0); }} />
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredData.slice(currentIndex, currentIndex + itemsPerPage).map((crypto) => (
                        <CryptoCard
                            key={crypto.id}
                            name={crypto.name}
                            image={crypto.image}
                            price={crypto.current_price}
                            marketCap={crypto.market_cap}
                        />
                    ))}
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