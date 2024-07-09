// src\views\apps\v2Pools\components\AddLiquidity.tsx
import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Slider, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { PoolDetails } from 'src/pages/apps/v2Pools/index';
import Translations from 'src/layouts/components/Translations';
import axios from 'src/configs/axiosConfig';

interface AddLiquidityProps {
  poolDetails?: PoolDetails;
  userWalletBalanceA: number;
  userWalletBalanceB: number;
  onLiquidityAdded: () => Promise<void>;
}

const AddLiquidity: React.FC<AddLiquidityProps> = ({ poolDetails, userWalletBalanceA, userWalletBalanceB, onLiquidityAdded }) => {
  const [amountA, setAmountA] = useState(0);
  const [amountB, setAmountB] = useState(0);
  const [lastChanged, setLastChanged] = useState<'A' | 'B'>('A');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [liquidityResult, setLiquidityResult] = useState({ amountA: 0, amountB: 0 });

  useEffect(() => {
    if (poolDetails && lastChanged === 'A') {
      const calculatedAmountB = calculateOutput(poolDetails.tokenAReserve, poolDetails.tokenBReserve, amountA);
      setAmountB(calculatedAmountB);
    } else if (poolDetails && lastChanged === 'B') {
      const calculatedAmountA = calculateOutput(poolDetails.tokenBReserve, poolDetails.tokenAReserve, amountB);
      setAmountA(calculatedAmountA);
    }
  }, [amountA, amountB, lastChanged, poolDetails]);


  const calculateOutput = (reserveInput: number, reserveOutput: number, amountInput: number) => {
    return (amountInput * reserveOutput) / reserveInput;
  };

  const handleAmountAChange = (newValue: number) => {
    setAmountA(newValue);
    setLastChanged('A');
  };

  const handleAmountBChange = (newValue: number) => {
    setAmountB(newValue);
    setLastChanged('B');
  };


  const handleAddLiquidity = async () => {
    if (!poolDetails) {
      console.error("Pool details are not available.");

      return;
    }

    const { tokenA, tokenB } = poolDetails;
    const amountADesired = amountA.toString(); // Convert to string if needed
    const amountBDesired = amountB.toString(); // Convert to string if needed

    try {
      const response = await axios.post(`/pools/${tokenA}/${tokenB}/add-liquidity`, {
        amountADesired,
        amountBDesired
      });
      console.log('Liquidity added successfully:', response.data);
      setLiquidityResult({ amountA, amountB });
      setOpenSnackbar(true);
      setOpenDialog(true);
      if (onLiquidityAdded) {
        await onLiquidityAdded();
      }
    } catch (error: any) {
      console.error('Error adding liquidity:', error.response ? error.response.data : error.message);
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
      <h3><Translations text="Add Liquidity" /></h3>
      <Slider
        value={amountA}
        onChange={(e, newValue) => handleAmountAChange(newValue as number)}
        step={1}
        min={0}
        max={userWalletBalanceA}
        valueLabelDisplay="auto"
      />
      <TextField
        label={<Translations text="Amount for Token A" />}
        type="number"
        value={amountA}
        onChange={(e) => handleAmountAChange(Number(e.target.value))}
        fullWidth
      />
      <Slider
        value={amountB}
        onChange={(e, newValue) => handleAmountBChange(newValue as number)}
        step={1}
        min={0}
        max={userWalletBalanceB}
        valueLabelDisplay="auto"
      />
      <TextField
        label={<Translations text="Amount for Token B" />}
        type="number"
        value={amountB}
        onChange={(e) => handleAmountBChange(Number(e.target.value))}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleAddLiquidity}>
        <Translations text="Add" />
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle><Translations text="Liquidity Added Successfully" /></DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Translations text="Amount A added" />: {liquidityResult.amountA.toFixed(2)}
            <br />
            <Translations text="Amount B added" />: {liquidityResult.amountB.toFixed(2)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}><Translations text="OK" /></Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          <Translations text="Liquidity added successfully. Amounts added - A:" /> {liquidityResult.amountA.toFixed(2)},
          <Translations text="B:" /> {liquidityResult.amountB.toFixed(2)}
        </Alert>
      </Snackbar>
    </div >
  );
};

export default AddLiquidity;
