const BASE_URL = "https://api.coingecko.com/api/v3";

export const getCryptoData = async () => {
    try {
        const url = `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching crypto data:", error);
        throw error;
    }
};
