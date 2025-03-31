import React, { useState } from "react";

type SearchBarProps = {
    onSearch: (query: string) => void;
    onCancel: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onCancel }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
            <div className="flex items-center gap-2  mb-6">
                <div className="flex items-center shadow-lg w-1/2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        placeholder="Search for a cryptocurrency..."
                        onFocus={(e) => e.target.classList.add("placeholder-transparent")}
                        onBlur={(e) => e.target.classList.remove("placeholder-transparent")}
                        className="p-2 bg-[#282740] w-full focus:outline-none"
                    />
                    <button
                        onClick={handleCancel}
                        className="bg-[#282740] text-zinc-300 px-4 py-2 hover:bg-[#362339]"
                    >
                        Cancel
                    </button>
                </div>
            <button
                onClick={handleSearch}
                className="bg-[#100d53] text-zinc-300 px-4 py-2 shadow-md transition hover:bg-[#370d53]"
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;
