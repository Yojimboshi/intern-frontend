// src\views\apps\wallet\eWallet\transfer.tsx
import React, { useState } from 'react';
import {
  Button, TextField, Typography, Box, Grid,
} from '@mui/material';
import { useEWallet } from 'src/hooks/useEWallet';
import Translations from 'src/layouts/components/Translations';

const TransferView: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const { transfer } = useEWallet(); // Adjusted to use useEWallet hook

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleRecipientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(event.target.value);
  };

  const handleTransfer = () => {
    transfer({ amount, recipient });

    // Handle the transfer logic here
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            <Translations text="Transfer Funds" /> {/* Adjusted text */}
          </Typography>
          <Box sx={{ my: 2 }}>
            <TextField
              label={<Translations text="Recipient ID" />}
              value={recipient}
              onChange={handleRecipientChange}
              sx={{ mr: 2, mb: 2 }}
              fullWidth
            />
            <TextField
              label={<Translations text="Amount" />}
              value={amount}
              onChange={handleAmountChange}
              type="number"
              fullWidth
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleTransfer} sx={{ my: 2 }}>
            <Translations text="Transfer" />
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TransferView;
