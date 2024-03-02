// src\views\dashboards\analytics\UserWalletData.tsx
import React, { useEffect, useState, useRef } from 'react';
import CardStatsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal';
import Icon from 'src/@core/components/icon'
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import axios from 'src/configs/axiosConfig';
import { WalletData } from 'src/types/apps/walletTypes';
import Translations from 'src/layouts/components/Translations';

const UserWalletData: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isOverflowed, setIsOverflowed] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWalletBalances = async () => {
      try {
        const response = await axios.get('/ewallet/wallet/balances');
        console.log('walletBalances', response.data);
        if (response.data && response.data.ewalletBalances && Array.isArray(response.data.ewalletBalances)) {
          setWalletData(response.data);
        } else {
          // Handle the case where ewalletBalances is not as expected
          console.error('Unexpected response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching wallet balances:', error);
      }
    };

    fetchWalletBalances();
    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);


  const checkOverflow = () => {
    if (scrollContainerRef.current) {
      const isOverflow = scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth;
      setIsOverflowed(isOverflow);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };


  const getIconFromSymbol = (tokenSymbol: string) => {
    const icons: { [key: string]: string } = {
      BTC: 'currency-btc',
      ETH: 'ethereum',
      USDT: 'currency-usd-circle',
      DUMMY: 'diamond-stone',
      DAI: 'currency-usd',
    };

    return `mdi-${icons[tokenSymbol.toUpperCase()] || 'coin'}`;
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', mt: 4 }}>
      {walletData ? (
        <>
          <h3><Translations text="User Wallet Balances" /></h3>
          {isOverflowed && (
            <IconButton
              onClick={() => handleScroll('left')}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 0, // adjust as needed
                zIndex: 1
              }}
            >
              <Icon icon="mdi-chevron-left" />
            </IconButton>
          )}
          <Box ref={scrollContainerRef} sx={{ overflowX: 'hidden', display: 'flex', flexGrow: 1 }}>
            <Grid container spacing={2} wrap="nowrap">
              {/* Combine both arrays and map over them for rendering */}
              {...walletData.ewalletBalances.map((balance: any, index: number) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <CardStatsHorizontal
                    stats={Number(balance.balance).toFixed(4)}
                    title={`${balance.tokenSymbol || balance.ewalletCoin.name}`}
                    icon={<Icon icon={getIconFromSymbol(balance.tokenSymbol || 'wallet')} />}
                    trendNumber="..."
                    color="secondary"
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          {isOverflowed && (
            <IconButton
              onClick={() => handleScroll('right')}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0, // adjust as needed
                zIndex: 1
              }}
            >
              <Icon icon="mdi-chevron-right" />
            </IconButton>
          )}
        </>
      ) : (
        <p><Translations text="Loading..." /></p>
      )}
    </Box>
  );
};

export default UserWalletData;
