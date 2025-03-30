import React from "react";

interface CryptoCardProps {
    name: string;
    image: string;
    price: number;
    marketCap: number;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ name, image, price, marketCap }) => {
    return (
        <div className="p-4 border bg-white rounded-2xl shadow-lg flex items-center gap-4">
            <img src={image} alt={`${name} logo`} className="w-12 h-12" />
            <div>
                <h3 className="text-xl font-bold">{name}</h3>
                <p className="text-gray-500">Price: ${price.toLocaleString()}</p>
                <p className="text-gray-500">Market Cap: ${marketCap.toLocaleString()}</p>
            </div>
        </div>
    );
};

export default CryptoCard;
