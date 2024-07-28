// src\views\apps\cryptoWallet\withdraw.tsx
import React, { useState, useEffect } from 'react';
import {
  Grid, Button, TextField, FormControl, InputLabel, Select,
  MenuItem, Typography, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { useCrypto } from 'src/hooks/useCrypto';
import NETWORK_TOKEN_MAPPING from 'src/configs/networkTokenMapping';
import { Network } from 'src/types/apps/networkTypes';
import Translations from 'src/layouts/components/Translations';
import { useTranslation } from 'react-i18next';

const WithdrawView = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState<Network['code']>('');
  const [tokenSymbol, setTokenSymbol] = useState(''); // Initialized as an empty string
  const [filteredTokens, setFilteredTokens] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { withdraw, loading } = useCrypto();

  // Update filtered tokens whenever the network changes
  useEffect(() => {
    const tokens = network ? NETWORK_TOKEN_MAPPING[network] || [] : [];
    setFilteredTokens(tokens);
    // Reset tokenSymbol if it's not available in the new network
    if (!tokens.includes(tokenSymbol)) {
      setTokenSymbol(tokens[0] || ''); // Automatically select the first available token for the selected network
    }
  }, [network, tokenSymbol]);

  const handleWithdraw = async () => {
    if (!amount || !address || !network || !tokenSymbol) {
      setErrorMessage(t('PleaseProvideAllDetails'));
      return;
    }

    const response = await withdraw(amount, address, tokenSymbol, network);

    if (!response.success) {
      setErrorMessage(response.message);
    } else {
      setAmount('');
      setAddress('');
      setNetwork('');
      setTokenSymbol('');
      setErrorMessage(null);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Typography variant="h4" gutterBottom>
          <Translations text="Withdraw" />
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel><Translations text="Network" /></InputLabel>
          <Select
            value={network}
            label={<Translations text="Network" />}
            onChange={(e) => setNetwork(e.target.value as Network['code'])}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {Object.keys(NETWORK_TOKEN_MAPPING).map((net) => (
              <MenuItem key={net} value={net}>{net}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" disabled={filteredTokens.length === 0}>
          <InputLabel><Translations text="Token" /></InputLabel>
          <Select
            value={tokenSymbol}
            label={<Translations text="Token" />}
            onChange={(e) => setTokenSymbol(e.target.value)}
          >
            {filteredTokens.map(token => (
              <MenuItem key={token} value={token}>{token}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label={<Translations text="Address" />}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label={<Translations text="Amount" />}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
            type="number"
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleWithdraw}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : <Translations text="Withdraw" />}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
          <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default WithdrawView;
