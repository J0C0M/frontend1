import axios from "axios";

// Base URL for the CoinGecko API
const BASE_URL = "https://api.coingecko.com/api/v3";

export const getCryptoData = async () => {
    try {
        const url = `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=23&page=1&sparkline=false`;
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.error("Error fetching crypto data:", error);
        throw error;
    }
};

export const getCryptoDetail = async (id: string) => {
    try {
        const url = `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.error(`Error fetching details for ${id}:`, error);
        throw error;
    }
};