import React from "react";

// Define props interface for the CryptoCardComponent component
interface CryptoCardProps {
    id: string; // Unique identifier for the cryptocurrency
    name: string; // Name of the cryptocurrency
    image: string; // URL to the cryptocurrency logo image
    price: number; // Current price in USD
    marketCap: number; // Market capitalization in USD
    isFavorite: boolean; // Whether this cryptocurrency is in favorites
    onToggleFavorite: (id: string) => void; // Function to toggle favorite status
    onCryptoSelect: (id: string) => void; // Function to select this crypto for detailed view
}

/**
 * Component that displays a single cryptocurrency as a card with basic information
 */
const CryptoCardComponent: React.FC<CryptoCardProps> = (
    {
        id,
        name,
        image,
        price,
        marketCap,
        isFavorite,
        onToggleFavorite,
        onCryptoSelect
    }) => {
    // Handle click on the card to view cryptocurrency details
    const handleCardClick = () => {
        onCryptoSelect(id);
    };

    // Handle click on the favorite button, preventing the card click
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the card click from triggering
        onToggleFavorite(id);
    };

    return (
        <div
            className="px-2 py-1 shadow-lg
            bg-[linear-gradient(to_right,_#282740,_rgba(0,128,128,0)_50px),_linear-gradient(to_left_,_#242339,_rgba(0,128,128,0)_50px)]
            flex items-center gap-4 cursor-pointer hover:bg-[#323151] transition-colors"
            onClick={handleCardClick}
        >
            <img src={image} alt={`${name} logo`} className="w-12 h-12" />
            <h3 className="text-xl font-bold text-zinc-200 w-1/6">{name}</h3>
            <p className="text-zinc-200 w-1/6">
                <p>Price:</p>
                <p>${price.toLocaleString()}</p>
            </p>
            <p className="text-zinc-200 w-1/6">
                <p>Market Cap:</p>
                <p className="text-lime-600">${marketCap.toLocaleString()}</p>
            </p>
            <button
                onClick={handleFavoriteClick}
                className="ml-auto mr-2 px-3 py-1">
                {isFavorite ? (
                    <span className="text-yellow-400 text-xl">★</span>
                ) : (
                    <span className="text-zinc-400 text-xl">☆</span>
                )}
            </button>
        </div>
    );
};

export default CryptoCardComponent;