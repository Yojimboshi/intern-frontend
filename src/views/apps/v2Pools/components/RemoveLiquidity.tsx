// src\views\apps\v2Pools\components\RemoveLiquidity.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Button, Slider, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { PoolDetails } from 'src/pages/apps/v2Pools/index';
import axios from 'src/configs/axiosConfig';
import Translations from 'src/layouts/components/Translations';

interface RemoveLiquidityProps {
  poolDetails?: PoolDetails;
  selectedTab: number;
  onLiquidityRemoved: () => Promise<void>;
}

interface LPTokenBalance {
  v2PoolId: number;
  liquidityTokens: number;
  tokenA: string;
  tokenB: string;
}

const RemoveLiquidity: React.FC<RemoveLiquidityProps> = ({ poolDetails, selectedTab, onLiquidityRemoved }) => {
  const [percentage, setPercentage] = useState(0);
  const [allLPTokenBalances, setAllLPTokenBalances] = useState<LPTokenBalance[]>([]);
  const [userLPTokens, setUserLPTokens] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [liquidityResult, setLiquidityResult] = useState({ amountA: 0, amountB: 0 });

  useEffect(() => {
    if (selectedTab === 2) {
      fetchAllUserLPTokens();
    }
  }, [selectedTab, poolDetails]);


  useEffect(() => {
    if (poolDetails) {
      const lpBalance = allLPTokenBalances.find(balance => balance.v2PoolId === poolDetails.id);
      setUserLPTokens(lpBalance ? lpBalance.liquidityTokens : 0);
    }
  }, [poolDetails, allLPTokenBalances]);


  const fetchAllUserLPTokens = async () => {
    try {
      const response = await axios.get('/pools/get-lp-token-balance');
      if (response.data && response.data.balances) {
        setAllLPTokenBalances(response.data.balances);
      }
    } catch (error) {
      console.error('Error fetching all LP token balances:', error);
    }
  };


  const { amountA, amountB } = useMemo(() => {
    if (!poolDetails || !userLPTokens) {
      return { amountA: 0, amountB: 0 };
    }

    const userShare = percentage / 100;
    const amountA = poolDetails.tokenAReserve * userShare * (userLPTokens / poolDetails.totalLPTokenSupply);
    const amountB = poolDetails.tokenBReserve * userShare * (userLPTokens / poolDetails.totalLPTokenSupply);

    return { amountA, amountB };
  }, [percentage, poolDetails, userLPTokens]);


  const handleRemoveLiquidity = async () => {
    if (!poolDetails) {
      console.error("Pool details are not available.");

      return;
    }

    const { tokenA, tokenB } = poolDetails;
    const liquidityToRemove = userLPTokens * (percentage / 100);
    const amountAMin = amountA;
    const amountBMin = amountB;

    try {
      const response = await axios.post(`/pools/${tokenA}/${tokenB}/remove-liquidity`, {
        liquidityTokens: liquidityToRemove,
        amountAMin,
        amountBMin
      });
      console.log('Liquidity removed successfully:', response.data);
      setLiquidityResult({ amountA, amountB });
      setOpenSnackbar(true);
      setOpenDialog(true);
      if (onLiquidityRemoved) {
        await onLiquidityRemoved();
      }
    } catch (error: any) {
      console.error('Error removing liquidity:', error.response ? error.response.data : error.message);
    }
  };


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <h3><Translations text="Remove Liquidity" /></h3>
      <Slider
        value={percentage}
        onChange={(e, newValue) => setPercentage(newValue as number)}
        step={1}
        min={0}
        max={100}
        valueLabelDisplay="auto"
      />
      <div>
        <p><Translations text="Amount for Token A" />: {amountA}</p>
        <p><Translations text="Amount for Token B" />: {amountB}</p>
      </div>
      <Button variant="contained" color="secondary" onClick={handleRemoveLiquidity}>
        <Translations text="Remove" />
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle><Translations text="Liquidity Removal Successful" /></DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Translations text="Amount A received" />: {liquidityResult.amountA.toFixed(2)}
            <br />
            <Translations text="Amount B received" />: {liquidityResult.amountB.toFixed(2)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}><Translations text="OK" /></Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          <Translations text="Liquidity removed. Amount A" />: {liquidityResult.amountA.toFixed(2)},
          <Translations text="Amount B" />: {liquidityResult.amountB.toFixed(2)}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RemoveLiquidity;
