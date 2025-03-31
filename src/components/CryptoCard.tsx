import React from "react";

interface CryptoCardProps {
    name: string;
    image: string;
    price: number;
    marketCap: number;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ name, image, price, marketCap }) => {
    return (
        <div className="px-2 py-1 shadow-lg
        bg-[linear-gradient(to_right,_#282740,_rgba(0,128,128,0)_50px),_linear-gradient(to_left_,_#242339,_rgba(0,128,128,0)_50px)]
        flex items-center gap-4">
            <img src={image} alt={`${name} logo`} className="w-12 h-12" />
            <h3 className="text-xl font-bold text-zinc-300 w-1/6">{name}</h3>
            <p className="text-zinc-300 w-1/6">
                <p>Price:</p>
                <p>${price.toLocaleString()}</p>
            </p>
            <p className="text-zinc-300 w-1/6">
                <p>Market Cap:</p>
                <p className="text-lime-600">${marketCap.toLocaleString()}</p>
            </p>
        </div>
    );
};

export default CryptoCard;
