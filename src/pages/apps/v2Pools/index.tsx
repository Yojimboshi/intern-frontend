// src\pages\apps\v2Pools\index.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/store'
import { fetchPools } from 'src/store/apps/v2Pools';
import Translations from 'src/layouts/components/Translations';
import {
  Menu, MenuItem, IconButton,
  Tabs, Tab, Paper, Box, Button
} from '@mui/material';
import Icon from 'src/@core/components/icon'
import SwapComponent from 'src/views/apps/v2Pools/components/SwapComponent'; // Component for swapping tokens
import AddLiquidity from 'src/views/apps/v2Pools/components/AddLiquidity'; // Component for adding liquidity
import RemoveLiquidity from 'src/views/apps/v2Pools/components/RemoveLiquidity'; // Component for removing liquidity
import PoolChart from 'src/views/apps/v2Pools/components/PoolChart'; // Component for the yx = k curve chart
import { useV2Pool } from 'src/hooks/useV2Pool';
import { WalletData } from 'src/types/apps/walletTypes';
import axios from 'src/configs/axiosConfig';

export interface PoolDetails {
  id: number;
  tokenA: string;
  tokenB: string;
  tokenAReserve: number;
  tokenBReserve: number;
  totalLPTokenSupply: number;
}

const V2Pools = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pools = useSelector((state: RootState) => state.pools.data);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPoolPair, setSelectedPoolPair] = useState('');
  const [selectedPoolDetails, setSelectedPoolDetails] = useState<PoolDetails | undefined>();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { performSwap } = useV2Pool();
  const open = Boolean(anchorEl);


  useEffect(() => {
    if (pools.length === 0) {
      dispatch(fetchPools());
    }
  }, [dispatch, pools.length]);

  useEffect(() => {
    fetchWalletBalances();
  }, []);

  useEffect(() => {
    const newPoolDetails = getSelectedPoolDetails();
    setSelectedPoolDetails(newPoolDetails);
  }, [pools, selectedPoolPair]);

  const fetchWalletBalances = async () => {
    try {
      const response = await axios.get('/ewallet/wallet/balances');
      if (response.data && response.data.ewalletBalances && Array.isArray(response.data.ewalletBalances)) {
        setWalletData(response.data);
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching wallet balances:', error);
    }
  };

  const onTransactionCompleted = async () => {
    await fetchWalletBalances();
    dispatch(fetchPools());
  };

  const getSelectedPoolDetails = (): PoolDetails | undefined => {
    if (!selectedPoolPair) return undefined;
    const [tokenA, tokenB] = selectedPoolPair.split('/');
    const pool = pools.find(p => (p.tokenA === tokenA && p.tokenB === tokenB) || (p.tokenA === tokenB && p.tokenB === tokenA));
    if (!pool) return undefined;
    const isFlipped = pool.tokenA !== tokenA;

    return {
      id: pool.id,
      tokenA: tokenA,
      tokenB: tokenB,
      tokenAReserve: isFlipped ? pool.tokenBReserve : pool.tokenAReserve,
      tokenBReserve: isFlipped ? pool.tokenAReserve : pool.tokenBReserve,
      totalLPTokenSupply: pool.totalLPTokenSupply
    };
  };

  const getBalanceForToken = (tokenSymbol: string): number => {
    const balanceEntry = walletData?.cryptoBalances.find(balance => balance.tokenSymbol === tokenSymbol);

    return balanceEntry ? parseFloat(balanceEntry.totalBalance) : 0;
  };

  const userWalletBalanceA = selectedPoolDetails ? getBalanceForToken(selectedPoolDetails.tokenA) : 0;
  const userWalletBalanceB = selectedPoolDetails ? getBalanceForToken(selectedPoolDetails.tokenB) : 0;


  const handleSelectPoolPair = (tokenPair: string) => {
    setSelectedPoolPair(tokenPair);
    handleClose();
  };

  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSwapTokens = () => {
    const [tokenA, tokenB] = selectedPoolPair.split('/');
    setSelectedPoolPair(`${tokenB}/${tokenA}`);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label={<Translations text="Swap" />} />
        <Tab label={<Translations text="Add Liquidity" />} />
        <Tab label={<Translations text="Remove Liquidity" />} />
      </Tabs>

      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Box display="flex" alignItems="center">
          <Button
            aria-controls="pool-pair-menu"
            aria-haspopup="true"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Translations text={selectedPoolPair || 'Select Pool Pair'} />
          </Button>
          <Menu id="pool-pair-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
            {pools.map((pool, index) => (
              <MenuItem key={index} onClick={() => handleSelectPoolPair(`${pool.tokenA}/${pool.tokenB}`)}>
                {`${pool.tokenA}/${pool.tokenB}`}
              </MenuItem>
            ))}
          </Menu>
          <IconButton onClick={handleSwapTokens}>
            <Icon icon="tdesign:swap" fontSize={20} /> {/* Using the Iconify icon */}
          </IconButton>
        </Box>
      </Box>

      <PoolChart selectedPoolDetails={selectedPoolDetails} />

      <Paper elevation={3}>
        {selectedTab === 0 && <SwapComponent
          onSwap={performSwap}
          selectedPoolDetails={selectedPoolDetails}
          userWalletBalanceA={userWalletBalanceA}
          userWalletBalanceB={userWalletBalanceB}
          onTransactionCompleted={onTransactionCompleted} />}
        {selectedTab === 1 && <AddLiquidity
          userWalletBalanceA={userWalletBalanceA}
          userWalletBalanceB={userWalletBalanceB}
          poolDetails={selectedPoolDetails}
          onLiquidityAdded={onTransactionCompleted} />}
        {selectedTab === 2 && <RemoveLiquidity
          selectedTab={selectedTab}
          poolDetails={selectedPoolDetails}
          onLiquidityRemoved={onTransactionCompleted} />}
      </Paper>

      {selectedPoolDetails && (
        <Box>
          <h3><Translations text="Pool Details" /></h3>
          <p><Translations text="Token A" />: {selectedPoolDetails.tokenA}</p>
          <p><Translations text="Token B" />: {selectedPoolDetails.tokenB}</p>
          <p><Translations text="Token A Reserve" />: {selectedPoolDetails.tokenAReserve}</p>
          <p><Translations text="Token B Reserve" />: {selectedPoolDetails.tokenBReserve}</p>
          <p><Translations text="Total LP Tokens Supply" />: {selectedPoolDetails.totalLPTokenSupply}</p>
        </Box>

      )}
    </Box>
  );
};

export default V2Pools;
