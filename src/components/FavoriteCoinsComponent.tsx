import React, { useState } from "react";
import CryptoCard from "./CryptoCard";
import PageSwitch from "./PageSwitchCard";

interface Crypto {
    id: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
}

interface FavoriteCoinsProps {
    favorites: string[];
    cryptoData: Crypto[];
    onToggleFavorite: (id: string) => void;
}

const FavoriteCoins: React.FC<FavoriteCoinsProps> = ({
                                                         favorites,
                                                         cryptoData,
                                                         onToggleFavorite
                                                     }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const itemsPerPage = 4;

    const favoriteCoins = cryptoData.filter(crypto => favorites.includes(crypto.id));

    return (
        <div className="rounded-lg shadow-lg p-4
                          flex flex-col items-center h-full">
            <h1 className="text-2xl font-bold text-zinc-200 mb-4">Favorite Cryptocurrencies</h1>

            {favorites.length === 0 ? (
                <div className=" p-4 rounded-md text-center
                                text-zinc-300 h-48 flex flex-col items-center justify-center">
                    <h2 className="pb-4 font-bold">No favorite cryptocurrencies selected yet.</h2>
                    <p>Click the ☆ icon on any coin to add it </p>
                    <p>to favorites.</p>
                </div>
            ) : (
                <div className="w-full">
                    <div className="flex flex-col gap-4 mb-4">
                        {favoriteCoins
                            .slice(currentIndex, currentIndex + itemsPerPage)
                            .map((crypto) => (
                                <CryptoCard
                                    key={crypto.id}
                                    id={crypto.id}
                                    name={crypto.name}
                                    image={crypto.image}
                                    price={crypto.current_price}
                                    marketCap={crypto.market_cap}
                                    isFavorite={true}
                                    onToggleFavorite={onToggleFavorite}
                                />
                            ))
                        }
                    </div>
                    <PageSwitch
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        totalItems={favoriteCoins.length}
                        itemsPerPage={itemsPerPage}
                    />
                </div>
            )}
        </div>
    );
};

export default FavoriteCoins;