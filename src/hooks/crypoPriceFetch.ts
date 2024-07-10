// src\hooks\crypoPriceFetch.ts
import { useState, useEffect } from 'react';

type CryptoChange = {
  name: string;
  dailyChange: number; // Adjust the type if necessary
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

        // Generate dates from today to 6 days before
        for (let i = 0; i <= 6; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          const formattedDate = `${day}-${month}-${year}`; // Format as dd-mm-yyyy
          dates.push(formattedDate);
        }

        console.log('Dates:', dates); // Log the dates

        // Fetch data for each date
        const fetchPromises = dates.map(async (date) => {
          const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${date}`);
          const data = await response.json();
          console.log('Fetched data for date:', date, data); // Log the fetched data
          const dailyChange = data.market_cap.usd;
          changes.push(dailyChange);
        });

        await Promise.all(fetchPromises);

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
