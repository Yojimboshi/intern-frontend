// src\views\dashboards\analytics\UserWalletData.tsx
import React, { useEffect, useState, useRef } from 'react';
import CardStatsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal';
import Icon from 'src/@core/components/icon'
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { Tooltip, Avatar } from '@mui/material';
import { useEWallet } from 'src/hooks/useEWallet';
import { WalletData, CryptoBalance, EwalletBalance } from 'src/types/apps/walletTypes';
import Translations from 'src/layouts/components/Translations';

const UserWalletData: React.FC = () => {
  const [walletData, setWalletData] = useState<any[]>([]); // Adjust type as necessary
  const [isOverflowed, setIsOverflowed] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { getUserBalances } = useEWallet();

  useEffect(() => {
    const fetchAndCombineWalletBalances = async () => {
      const response = await getUserBalances(); // Assuming this fetches both cryptoWallet and ewallet data
      const combinedData = [
        ...response.cryptoBalances.map((item: CryptoBalance) => ({
          tokenSymbol: item.tokenSymbol,
          balance: item.totalBalance,
          fullName: item.tokenSymbol,
          icon: getIconFromSymbol(item.tokenSymbol),
        })),
        ...response.ewalletBalances.map((item: EwalletBalance) => ({
          tokenSymbol: item.ewalletCoin.symbol,
          balance: item.balance,
          fullName: item.ewalletCoin.name,
        }))
      ];

      setWalletData(combinedData);
    };

    fetchAndCombineWalletBalances();
    checkOverflow();
    window.addEventListener('resize', checkOverflow);

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
    return `/images/icons/${tokenSymbol.toUpperCase()}.png`;
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
              {walletData.map((balance, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Tooltip
                    title={`${balance.fullName}: ${Number(balance.balance).toFixed(4)}`}
                    arrow
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'secondary',
                        width: 56,
                        height: 56,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      {balance.icon ? (
                        <img
                          src={balance.icon}
                          alt={balance.tokenSymbol}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        balance.tokenSymbol
                      )}
                    </Avatar>
                  </Tooltip>
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
