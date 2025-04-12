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
    const itemsPerPage = 3;

    const favoriteCoins = cryptoData.filter(crypto => favorites.includes(crypto.id));

    if (favorites.length === 0) {
        return (
            <div className="mt-8 mb-6">
                <h2 className="text-2xl font-bold text-zinc-200 mb-4">Favorite Cryptocurrencies</h2>
                <div className="bg-[#282740] p-4 rounded-md text-center text-zinc-300">
                    Je hebt nog geen favoriete cryptocurrencies geselecteerd.
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 mb-6">
            <h2 className="text-2xl font-bold text-zinc-200 mb-4">Favorite Cryptocurrencies</h2>
            <div className="flex flex-col gap-4">
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
    );
};

export default FavoriteCoins;