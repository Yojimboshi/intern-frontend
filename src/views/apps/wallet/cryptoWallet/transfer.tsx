// src\views\apps\cryptoWallet\transfer.tsx

import React, { useState } from 'react';
import {
  Button, TextField, MenuItem, Typography, Box, FormControl, InputLabel, Select, Snackbar, Alert
} from '@mui/material';
import { useCrypto } from 'src/hooks/useCrypto';
import SUPPORTED_TOKENS from 'src/configs/tokenConfig';
import Translations from 'src/layouts/components/Translations';
import { useTranslation } from 'react-i18next';

const TransferView = () => {
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('ETH');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false); // You need to manage the loading state
  const { transfer } = useCrypto();

  const handleTransfer = async () => {
    if (!amount || !recipient) {
      setErrorMessage(t('pleaseProvideRecipientAndAmount'));
      return;
    }

    setLoading(true);
    const response = await transfer(amount, recipient, tokenSymbol);
    setLoading(false);

    if (!response.success) {
      setErrorMessage(response.message);
    } else {
      setAmount('');
      setRecipient('');
      setTokenSymbol('ETH');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        <Translations text="Transfer" />
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          label={<Translations text="Recipient (Username/Address)" />}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label={<Translations text="Amount" />}
          type="text"  // Changed from "number" to "text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)} // Handle as a string
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel><Translations text="Token" /></InputLabel>
          <Select
            value={tokenSymbol}
            label={<Translations text="Token" />}
            onChange={(e) => setTokenSymbol(e.target.value)}
          >
            {SUPPORTED_TOKENS.map((token) => (
              <MenuItem key={token} value={token}>{token}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTransfer}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <Translations text="Processing..." /> : <Translations text="Transfer" />}
        </Button>
      </Box>
      {errorMessage && (
        <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
          <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default TransferView;
