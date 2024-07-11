// src\hooks\crypoPriceFetch.ts
import { useState, useEffect } from 'react';

// NOTE : change .push to .map



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

        // Generate dates from today to 6 days before
        for (let i = 0; i <= 6; i++) {
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
          const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&startTime=${new Date(date).getTime()}&endTime=${new Date(date).getTime() + 86400000}`);
          const data = await response.json();
          console.log('Fetched data for date:', date, data); // Log the fetched data
          const marketCapChange = data[0] ? (data[0][4] - data[0][1]) / data[0][1] * 100 : 0; // Calculate percentage change
          changes[i] = marketCapChange;
          await delay(1000); // Delay for 1 second between requests
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

export const usePriceChange = () => {
  const [priceChange, setPriceChange] = useState<PriceChange[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum%2Cbinancecoin%2Csolana%2Cripple&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=7d&locale=en`);
        const data = await response.json();// Log the fetched data
        const price: PriceChange[] = data.map((coin: any) => ({
          id: coin.id,
          priceChangeToday: coin.price_change_percentage_24h.toFixed(2),
          priceChangeBefore: coin.price_change_percentage_7d_in_currency.toFixed(2),
          high_24h: coin.high_24h,
          low_24h: coin.low_24h,
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
