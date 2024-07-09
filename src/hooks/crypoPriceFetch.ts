// src\hooks\crypoPriceFetch.ts
import { useState, useEffect } from 'react';

type CryptoChange = {
  name: string;
  dailyChange: number; // Adjust the type if necessary
};

export const useMarketCapChange = () => {
  const [marketCapChange, setMarketCapChange] = useState(null);
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

export const useChartChange = () => {//I am planning to use this as a function to get the chart from the api
  const [chartChange, setChartChange] = useState(null);
  const [loading2, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        const data = await response.json();

        const marketChartChange = data.data.sparkline;

        setChartChange(marketChartChange);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { chartChange, loading2 };
};

