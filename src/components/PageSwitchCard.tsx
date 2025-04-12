import React from "react";

interface PageSwitchProps {
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    totalItems: number;
    itemsPerPage: number;
}

const PageSwitch: React.FC<PageSwitchProps> = ({ currentIndex, setCurrentIndex, totalItems, itemsPerPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = totalPages > 0 ? Math.floor(currentIndex / itemsPerPage) + 1 : 0;

    const nextPage = () => {
        if (currentIndex + itemsPerPage < totalItems) {
            setCurrentIndex(currentIndex + itemsPerPage);
        }
    };

    const prevPage = () => {
        if (currentIndex - itemsPerPage >= 0) {
            setCurrentIndex(currentIndex - itemsPerPage);
        }
    };

    return (
        <div className="flex justify-center mt-4 gap-4 items-center">
            <button onClick={prevPage} disabled={currentIndex === 0}
                    className="px-4 p-2 bg-[#282740] shadow-lg text-white hover:bg-[#100d53]
                                transition disabled:opacity-50">←</button>
            <span className="text-zinc-300">Page {currentPage} of {totalPages}</span>
            <button onClick={nextPage} disabled={currentIndex + itemsPerPage >= totalItems}
                    className="px-4 py-2 bg-[#282740] shadow-lg text-white hover:bg-[#100d53]
                                transition disabled:opacity-50">→</button>
        </div>
    );
};

export default PageSwitch;
