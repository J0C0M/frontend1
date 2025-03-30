import React, { useState } from "react";

type SearchBarProps = {
    onSearch: (query: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <div className="flex items-center gap-2 mb-6">
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search for a cryptocurrency..."
                className="p-2 border rounded-md w-full shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;
