// src\views\apps\wallet\eWallet\convert.tsx
import React, { useState } from 'react';
import {
  Button, TextField, Typography, Box, Grid, Select, MenuItem,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useEWallet } from 'src/hooks/useEWallet'; // Use the appropriate hook
import Translations from 'src/layouts/components/Translations';

const ConvertView: React.FC = () => {
  const [sourceCurrency, setSourceCurrency] = useState('USD'); // Example currencies
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const { convert } = useEWallet(); // Assuming convertFunds exists in your hook

  const handleSourceChange = (event: SelectChangeEvent<string>) => {
    setSourceCurrency(event.target.value as string);
  };

  const handleTargetChange = (event: SelectChangeEvent<string>) => {
    setTargetCurrency(event.target.value as string);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleConvert = () => {
    convert({ sourceCurrency, targetCurrency, amount });

    // Handle the currency conversion logic here
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            <Translations text="Convert Funds" /> {/* Updated text */}
          </Typography>
          <Box sx={{ my: 2 }}>
            <Select
              value={sourceCurrency}
              onChange={handleSourceChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ minWidth: 120, mr: 2 }}
            >
              {/* Dropdown for source currency */}
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">Euro (EUR)</MenuItem>
              {/* More currency options */}
            </Select>
            <Select
              value={targetCurrency}
              onChange={handleTargetChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ minWidth: 120, mr: 2 }}
            >
              {/* Dropdown for target currency */}
              <MenuItem value="EUR">Euro (EUR)</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              {/* More currency options */}
            </Select>
            <TextField
              label={<Translations text="Amount" />}
              value={amount}
              onChange={handleAmountChange}
              type="number"
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleConvert} sx={{ my: 2 }}>
            <Translations text="Convert" />
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ConvertView;
