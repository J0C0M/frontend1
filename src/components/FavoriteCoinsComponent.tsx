import React, { useState } from "react";
import CryptoCardComponent from "./CryptoCardComponent.tsx";
import PageSwitch from "./PageSwitchComponent.tsx";

/**
 * Interface defining the structure of cryptocurrency data objects
 * @property {string} id - Unique identifier for the cryptocurrency
 * @property {string} name - Name of the cryptocurrency
 * @property {string} image - URL to the cryptocurrency's logo image
 * @property {number} current_price - Current price of the cryptocurrency
 * @property {number} market_cap - Market capitalization of the cryptocurrency
 */
interface Crypto {
    id: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
}

/**
 * Props interface for the FavoriteCoins component
 * @property {string[]} favorites - Array of cryptocurrency IDs marked as favorites
 * @property {Crypto[]} cryptoData - Array of cryptocurrency data objects
 * @property {(id: string) => void} onToggleFavorite - Callback to toggle favorite status of a coin
 * @property {(id: string) => void} onCryptoSelect - Callback when a cryptocurrency is selected
 */
interface FavoriteCoinsProps {
    favorites: string[];
    cryptoData: Crypto[];
    onToggleFavorite: (id: string) => void;
    onCryptoSelect: (id: string) => void;
}

/**
 * Component that displays a list of favorite cryptocurrencies
 * Implements pagination for displaying multiple favorites
 */
const FavoriteCoins: React.FC<FavoriteCoinsProps> = (
    {
        favorites,
        cryptoData,
        onToggleFavorite,
        onCryptoSelect
    }) => {
    // State to track the current page index for pagination
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    // Number of items to display per page
    const itemsPerPage = 4;

    // Filter cryptoData to only include coins that are in the favorites array
    const favoriteCoins = cryptoData.filter(crypto => favorites.includes(crypto.id));

    return (
        <div className="shadow-lg p-4 flex flex-col items-center h-full">
            <h1 className="text-2xl font-bold text-zinc-200 mb-4">Favorite Cryptocurrencies</h1>

            {favorites.length === 0 ? (
                // Display a message when no favorites have been selected
                <div className=" p-4 text-center text-zinc-300 h-48
                                 flex flex-col items-center justify-center">
                    <h2 className="pb-4 font-bold">No favorite cryptocurrencies selected yet.</h2>
                    <p>Click the ☆ icon on any coin to add it </p>
                    <p>to favorites.</p>
                </div>
            ) : (
                // Display the list of favorite cryptocurrencies
                <div className="w-full">
                    <div className="flex flex-col gap-4 mb-4">
                        {favoriteCoins
                            .slice(currentIndex, currentIndex + itemsPerPage)
                            .map((crypto) => (
                                <CryptoCardComponent
                                    key={crypto.id}
                                    id={crypto.id}
                                    name={crypto.name}
                                    image={crypto.image}
                                    price={crypto.current_price}
                                    marketCap={crypto.market_cap}
                                    isFavorite={true}
                                    onToggleFavorite={onToggleFavorite}
                                    onCryptoSelect={onCryptoSelect}
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