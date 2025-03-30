import React, { useEffect, useState } from "react";
import { getCryptoData } from "./utility/api";
import CryptoCard from "./components/CryptoCard";
import SearchBar from "./components/SearchBarCard";

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
    };

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-3xl font-bold text-white text-center mb-6">Cryptocurrency Prices</h1>
            <SearchBar onSearch={handleSearch} />
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData.map((crypto) => (
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
        </div>
    );
};

export default App;
