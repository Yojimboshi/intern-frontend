// src\views\apps\wallet\eWallet\deposit.tsx
import React, { useState } from 'react';
import {
  Button, TextField, Typography, Box, Grid, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { useEWallet } from 'src/hooks/useEWallet';
import { ICoin } from 'src/types/apps/coinTypes';
import Translations from 'src/layouts/components/Translations';

interface DepositViewProps {
  coins: ICoin[];
}

const DepositView: React.FC<DepositViewProps> = ({ coins }) => {
  const [amount, setAmount] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('');
  const { requestDeposit } = useEWallet();

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleCoinChange = (event: SelectChangeEvent<string>) => {
    setSelectedCoin(event.target.value);
  };

  const handleAddFunds = () => {
    // Assuming that selectedCoin is the coin's ID
    const coinId = parseInt(selectedCoin, 10);
    const depositAmount = parseFloat(amount);

    requestDeposit(coinId, depositAmount);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            <Translations text="Add Funds" />
          </Typography>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="coin-select-label">
              <Translations text="Select Coin" />
            </InputLabel>
            <Select
              labelId="coin-select-label"
              value={selectedCoin}
              label={<Translations text="Select Coin" />}
              onChange={handleCoinChange}
            >
              {coins.map((coin) => (
                <MenuItem key={coin.id} value={coin.id.toString()}>
                  {coin.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={<Translations text="Amount" />}
            value={amount}
            onChange={handleAmountChange}
            type="number"
            sx={{ minWidth: 120, mr: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddFunds}
            sx={{ my: 2 }}
          >
            <Translations text="Add" />
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DepositView;
