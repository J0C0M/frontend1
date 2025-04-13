import React from "react";

/**
 * Props interface for the PageSwitch component
 * @property {number} currentIndex - The starting index of currently displayed items
 * @property {React.Dispatch<React.SetStateAction<number>>} setCurrentIndex - State setter function for the currentIndex
 * @property {number} totalItems - Total number of items in the collection
 * @property {number} itemsPerPage - Number of items to display per page
 */
interface PageSwitchProps {
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    totalItems: number;
    itemsPerPage: number;
}

/**
 * Component that handles pagination controls
 * Displays current page number and navigation buttons
 */
const PageSwitch: React.FC<PageSwitchProps> = ({ currentIndex, setCurrentIndex, totalItems, itemsPerPage }) => {
    // Calculate total number of pages based on items and page size
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    // Calculate current page number (1-indexed for display)
    const currentPage = totalPages > 0 ? Math.floor(currentIndex / itemsPerPage) + 1 : 0;

    /**
     * Go to the next page if not on the last page
     */
    const nextPage = () => {
        if (currentIndex + itemsPerPage < totalItems) {
            setCurrentIndex(currentIndex + itemsPerPage);
        }
    };

    /**
     * Go to the previous page if not on the first page
     */
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