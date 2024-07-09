// src\views\apps\v2Pools\components\SwapComponent.tsx

import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Slider, Snackbar, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { PoolDetails } from 'src/pages/apps/v2Pools/index';
import Alert from '@mui/material/Alert';
import Translations from 'src/layouts/components/Translations';

interface SwapComponentProps {
  onSwap: (
    tokenA: string,
    tokenB: string,
    amount: number,
    inputBox?: string,
    onSwapCompleted?: () => Promise<void>
  ) => Promise<any>;
  selectedPoolDetails?: PoolDetails;
  userWalletBalanceA: number; // Added prop
  userWalletBalanceB: number; // Added prop
  onTransactionCompleted: () => Promise<void>;
}


const SwapComponent: React.FC<SwapComponentProps> = ({
  onSwap,
  selectedPoolDetails,
  userWalletBalanceA,
  userWalletBalanceB,
  onTransactionCompleted }) => {

  const [tokenA, setTokenA] = useState(selectedPoolDetails?.tokenA || '');
  const [tokenB, setTokenB] = useState(selectedPoolDetails?.tokenB || '');
  const [amount, setAmount] = useState(0);
  const [swapResult, setSwapResult] = useState<{ amountIn: number; amountOut: number; } | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');

  // const [inputBox, setInputBox] = useState('left');

  useEffect(() => {
    if (selectedPoolDetails) {
      setTokenA(selectedPoolDetails.tokenA);
      setTokenB(selectedPoolDetails.tokenB);
    }
  }, [selectedPoolDetails]);

  useEffect(() => {
    setAmount(0);
  }, [tokenA, tokenB]);

  const maxAmountForSlider = tokenA === selectedPoolDetails?.tokenA ? userWalletBalanceA : userWalletBalanceB;

  const handleSwap = async () => {
    if (tokenA && tokenB && amount > 0) {
      try {
        const response = await onSwap(tokenA, tokenB, amount, 'left');
        if (response && response.amountOut) {
          response.amountOut = Number(response.amountOut).toFixed(10);
        }
        setSwapResult(response);
        setOpenSnackbar(true); // Open the snackbar to show the result message
        if (response) {
          setOpenDialog(true);

          // Call the onTransactionCompleted to refresh the parent component's state
          await onTransactionCompleted();
        }
      } catch (error: any) {
        console.error('Swap error:', error);
        setError(error.message || 'An error occurred during the swap.');
        setOpenSnackbar(true); // Open the snackbar to show the error message
      }
    } else {
      setError('Invalid swap parameters');
      setOpenSnackbar(true); // Open the snackbar to show the error message
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
      <h3><Translations text="Swap Tokens" /></h3>
      {/* Add inputs for tokenA and tokenB */}
      <TextField
        label={<Translations text="Input" />}
        value={tokenA}
        onChange={(e) => setTokenA(e.target.value)}
        fullWidth
      />
      <TextField
        label={<Translations text="Output" />}
        value={tokenB}
        onChange={(e) => setTokenB(e.target.value)}
        fullWidth
      />

      <Slider
        value={amount}
        onChange={(e, newValue) => setAmount(newValue as number)}
        step={0.01}
        min={0}
        max={maxAmountForSlider}
        valueLabelDisplay="auto"
      />
      <TextField
        label={<Translations text="Amount" />}
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        inputProps={{ max: maxAmountForSlider }}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleSwap}>
        <Translations text="Swap" />
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle><Translations text="Swap Successful" /></DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Translations text="Amount In" />: {swapResult?.amountIn}
            <br />
            <Translations text="Amount Out" />: {swapResult?.amountOut}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}><Translations text="OK" /></Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        {swapResult ? (
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            <Translations text="Swap successful. Amount Out" />: {swapResult.amountOut}
          </Alert>
        ) : (
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}
      </Snackbar>

    </div>
  );
};

export default SwapComponent;
