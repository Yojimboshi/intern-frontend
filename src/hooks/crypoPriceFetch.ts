// src\hooks\crypoPriceFetch.ts
import { useState, useEffect } from 'react';

type CryptoChange = {
  name: string;
  dailyChange: number; // Adjust the type if necessary
};

type MarketCapChange = {
  timestamp: number;
  marketCap: number;
};


export const useMarketCapChange = () => {
  const [marketCapChanges, setMarketCapChanges] = useState<MarketCapChange[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://pro-api.coingecko.com/api/v3/global/market_cap_chart?vs_currency=usd&days=7', {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY' // Replace 'YOUR_API_KEY' with your actual API key
          }
        });
        const data = await response.json();

        if (data && data.market_cap_chart && data.market_cap_chart.market_cap) {
          const marketCapChangesData = data.market_cap_chart.market_cap.map((entry: [number, number]) => {
            return {
              timestamp: entry[0],
              marketCap: entry[1]
            };
          });
          setMarketCapChanges(marketCapChangesData);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching market cap changes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log("marketCapChanges", marketCapChanges)

  return { marketCapChanges, loading };
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
          dailyChange: coin.price_change_percentage_24h
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

