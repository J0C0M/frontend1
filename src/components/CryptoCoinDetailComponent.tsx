import React, { useEffect, useState } from "react";
import { getCryptoDetail } from "../utility/api";

interface CryptoDetailProps {
    cryptoId: string;
    onBack: () => void;
    onToggleFavorite: (id: string) => void;
    isFavorite: boolean;
}

interface CryptoDetailData {
    id: string;
    name: string;
    image: { large: string };
    symbol: string;
    market_data: {
        current_price: { usd: number };
        market_cap: { usd: number };
        high_24h: { usd: number };
        low_24h: { usd: number };
        price_change_percentage_24h: number;
        price_change_percentage_7d: number;
        price_change_percentage_30d: number;
        total_volume: { usd: number };
        circulating_supply: number;
        total_supply: number;
        max_supply: number;
    };
    description: { en: string };
    links: {
        homepage: string[];
        blockchain_site: string[];
    };
    genesis_date: string;
    sentiment_votes_up_percentage: number;
    sentiment_votes_down_percentage: number;
    coingecko_rank: number;
    last_updated: string;
}

const CryptoDetail: React.FC<CryptoDetailProps> = ({
                                                       cryptoId,
                                                       onBack,
                                                       onToggleFavorite,
                                                       isFavorite
                                                   }) => {
    const [cryptoData, setCryptoData] = useState<CryptoDetailData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCryptoDetail = async () => {
            try {
                setLoading(true);
                const data = await getCryptoDetail(cryptoId);
                setCryptoData(data);
            } catch (err) {
                setError("Failed to load cryptocurrency details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCryptoDetail();
    }, [cryptoId]);

    const handleToggleFavorite = () => {
        onToggleFavorite(cryptoId);
    };

    if (loading) {
        return (
            <div className="min-h-screen p-6 bg-[#242339] text-zinc-200">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Loading Details...</h1>
                        <button
                            onClick={onBack}
                            className="bg-[#242339] hover:bg-[#100d53]
                                       text-zinc-200 px-4 py-2">
                            Back to Dashboard
                        </button>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <p className="text-xl">Loading cryptocurrency data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !cryptoData) {
        return (
            <div className="min-h-screen p-6 bg-[#242339] text-zinc-200">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Error</h1>
                        <button
                            onClick={onBack}
                            className="bg-[#282740] hover:bg-[#100d53]
                                       text-zinc-200 px-4 py-2 ">
                            Back to Dashboard
                        </button>
                    </div>
                    <div className="bg-red-900/30 p-4">
                        <p className="text-xl">{error || "Failed to load cryptocurrency details"}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-[#1a1a2e] text-zinc-200">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <img
                            src={cryptoData.image.large}
                            alt={`${cryptoData.name} logo`}
                            className="w-12 h-12"
                        />
                        <h1 className="text-3xl font-bold">{cryptoData.name} ({cryptoData.symbol.toUpperCase()})</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleToggleFavorite}
                            className="bg-[#282740] hover:bg-[#100d53] text-zinc-200
                                         px-4 py-2 flex items-center gap-2">
                            {isFavorite ? (
                                <>
                                    <span className="text-yellow-400 text-xl">★</span>
                                    <span>Remove from Favorites</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-zinc-400 text-xl">☆</span>
                                    <span>Add to Favorites</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={onBack}
                            className="bg-[#282740] hover:bg-[#100d53] text-zinc-200 px-4 py-2">
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#282740] p-6 shadow-lg col-span-2">
                        <h2 className="text-2xl font-bold mb-4">Market Data</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-lg text-zinc-400">Current Price</h3>
                                <p className="text-2xl font-bold">${cryptoData.market_data.current_price.usd.toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="text-lg text-zinc-400">Market Cap</h3>
                                <p className="text-2xl font-bold">${cryptoData.market_data.market_cap.usd.toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="text-lg text-zinc-400">24h High</h3>
                                <p className="text-xl">${cryptoData.market_data.high_24h.usd.toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="text-lg text-zinc-400">24h Low</h3>
                                <p className="text-xl">${cryptoData.market_data.low_24h.usd.toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="text-lg text-zinc-400">Total Volume</h3>
                                <p className="text-xl">${cryptoData.market_data.total_volume.usd.toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="text-lg text-zinc-400">Circulating Supply</h3>
                                <p className="text-xl">{cryptoData.market_data.circulating_supply.toLocaleString()} {cryptoData.symbol.toUpperCase()}</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mt-8 mb-4">Price Change</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={`p-3 ${cryptoData.market_data.price_change_percentage_24h >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                                <h3 className="text-lg text-zinc-400">24h Change</h3>
                                <p className={`text-xl ${cryptoData.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {cryptoData.market_data.price_change_percentage_24h.toFixed(2)}%
                                </p>
                            </div>
                            <div className={`p-3 ${cryptoData.market_data.price_change_percentage_7d >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                                <h3 className="text-lg text-zinc-400">7d Change</h3>
                                <p className={`text-xl ${cryptoData.market_data.price_change_percentage_7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {cryptoData.market_data.price_change_percentage_7d.toFixed(2)}%
                                </p>
                            </div>
                            <div className={`p-3 ${cryptoData.market_data.price_change_percentage_30d >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                                <h3 className="text-lg text-zinc-400">30d Change</h3>
                                <p className={`text-xl ${cryptoData.market_data.price_change_percentage_30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {cryptoData.market_data.price_change_percentage_30d.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#282740] p-6 shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Information</h2>
                        <div className="mb-4">
                            <h3 className="text-lg text-zinc-400">CoinGecko Rank</h3>
                            <p className="text-xl">{cryptoData.coingecko_rank}</p>
                        </div>
                        {cryptoData.genesis_date && (
                            <div className="mb-4">
                                <h3 className="text-lg text-zinc-400">Genesis Date</h3>
                                <p className="text-xl">{new Date(cryptoData.genesis_date).toLocaleDateString()}</p>
                            </div>
                        )}
                        <div className="mb-4">
                            <h3 className="text-lg text-zinc-400">Sentiment</h3>
                            <div className="flex gap-4">
                                <p className="text-green-400">👍 {cryptoData.sentiment_votes_up_percentage.toFixed(1)}%</p>
                                <p className="text-red-400">👎 {cryptoData.sentiment_votes_down_percentage.toFixed(1)}%</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-lg text-zinc-400">Links</h3>
                            {cryptoData.links.homepage[0] && (
                                <a
                                    href={cryptoData.links.homepage[0]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 block">
                                    Official Website
                                </a>
                            )}
                            {cryptoData.links.blockchain_site[0] && (
                                <a
                                    href={cryptoData.links.blockchain_site[0]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 block">
                                    Blockchain Explorer
                                </a>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg text-zinc-400">Last Updated</h3>
                            <p className="text-zinc-300">{new Date(cryptoData.last_updated).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#282740] p-6 shadow-lg mb-8">
                    <h2 className="text-2xl font-bold mb-4">About {cryptoData.name}</h2>
                    <div
                        className="text-zinc-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: cryptoData.description.en }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CryptoDetail;