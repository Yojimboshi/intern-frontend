// src\hooks\crypoPriceFetch.ts
import { useState, useEffect } from 'react';

// NOTE : change .push to .map

type CryptoChange = {
  name: string;
  dailyChange: number;
};

type PriceChange = {
  id: string;
  priceChangeToday: number;
  priceChangeBefore: number;
  high_24h: number;
  low_24h: number;
};

export const useMarketCapChange = () => {
  const [marketCapChange, setMarketCapChange] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        const data = await response.json();

        const marketCapChangePercentage = data.data.market_cap_change_percentage_24h_usd;

        setMarketCapChange(marketCapChangePercentage);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { marketCapChange, loading };
};


export const useDailyCryptoChanges = () => {
  const [dailyChanges, setDailyChanges] = useState<CryptoChange[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1`);
        const data = await response.json();

        const changes: CryptoChange[] = data.map((coin: any) => ({
          name: coin.name,
          dailyChange: coin.price_change_percentage_24h // Adjust according to the actual data key
        }));

        setDailyChanges(changes);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { dailyChanges, loading };
};


export const useDailyChanges = () => {
  const [dailyChanges, setDailyChanges] = useState<number[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const dates: string[] = [];
        const changes: number[] = [];
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        // Generate dates from today to 6 days before //i try 4 first
        for (let i = 0; i <= 2; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          const formattedDate = `${day}-${month}-${year}`; // Format as dd-mm-yyyy
          dates[i] = formattedDate;
        }

        console.log('Dates:', dates); // Log the dates

        // Fetch data for each date with delay
        for (let i = 0; i < dates.length; i++) {
          const date = dates[i];
          const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${date}`);
          const data = await response.json();
          console.log('Fetched data for date:', date, data); // Log the fetched data
          const dailyChange = data.market_data?.market_cap?.usd ?? 0;
          changes[i] = dailyChange;
          await delay(1500); // Delay for 1.5 second between requests i will adjust later
        }

        console.log('Daily Changes:', changes); // Log the daily changes
        setDailyChanges(changes);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error fetching daily changes:', err);
      }
    };

    fetchData();
  }, []);

  return { dailyChanges, loading };
};


export const useTotalTransaction = () => {
  const [totalTransaction, setTotalTransaction] = useState<number[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const dates: string[] = [];
        const changes: number[] = [];
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        // Generate dates from today to 4 days before
        for (let i = 0; i <= 4; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          const formattedDate = `${year}-${month}-${day}`; // Format as yyyy-mm-dd
          dates[i] = formattedDate;
        }

        console.log('Dates:', dates); // Log the dates

        // Fetch data for each date with delay
        for (let i = 0; i < dates.length; i++) {
          const date = dates[i];
          const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=7d%2C14d&locale=en`);
          const data = await response.json();
          console.log('Fetched data for date:', date, data); // Log the fetched data
          const dailyChange = data.volume ?? 0; // Example field, adjust as necessary
          changes[i] = dailyChange;
          await delay(1500); // Delay for 1.5 seconds between requests
        }

        console.log('Daily Changes:', changes); // Log the daily changes
        setTotalTransaction(changes);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error fetching daily changes:', err);
      }
    };

    fetchData();
  }, []);

  return { totalTransaction, loading };
};


export const usePriceChange = () => {
  const [priceChange, setPriceChange] = useState<PriceChange[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {



        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=7d%2C14d&locale=en`);
        const data = await response.json();// Log the fetched data
        const price: PriceChange[] = data.map((coin: any) => ({
          id: coin.id,
          priceChangeToday: coin.price_change_percentage_24h.toFixed(2),
          priceChangeBefore: coin.price_change_percentage_7d_in_currency.toFixed(2),
          high_24h: coin.high_24h,
          low_24h: coin.low_24h, // Assuming 7 days change as "before"
        }));

        console.log('Price Changes:', price); // Log the daily changes
        setPriceChange(price);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error fetching daily changes:', err);
      }
    };

    fetchData();
  }, []);

  return { priceChange, loading };
};
