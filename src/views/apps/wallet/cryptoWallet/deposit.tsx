// src\views\apps\cryptoWallet\deposit.tsx
import React, { useState } from 'react';
import {
  Button, Table, TableBody, TableCell, TableHead,
  TableRow, Select, MenuItem, Typography, Box, Snackbar,
  Alert, CircularProgress, Grid,
} from '@mui/material';
import { useCrypto } from 'src/hooks/useCrypto';
import Translations from 'src/layouts/components/Translations';

interface DepositViewProps {
  addresses: {
    erc20Address?: string;
    trc20Address?: string;
    solanaAddress?: string;
  } | null;
  hasAddress: boolean | null;
  onGenerateAddress: () => void;
}

const DepositView: React.FC<DepositViewProps> = ({ addresses, hasAddress, onGenerateAddress }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('ERC20');
  const { loading } = useCrypto();

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSnackbarOpen(true); // Open the snackbar on success
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  };

  const handleNetworkChange = (event: any) => {
    setSelectedNetwork(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            <Translations text="Deposit" />
          </Typography>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {!loading && hasAddress === null && <Typography variant="h6">
            <Translations text="Checking..." /></Typography>}
          {!loading && hasAddress === false && (
            <Button variant="contained" color="primary" onClick={onGenerateAddress} sx={{ my: 2 }}>
              <Translations text="Generate Crypto Wallet" />
            </Button>
          )}
          {!loading && hasAddress && addresses && (
            <Table sx={{ mb: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6" component="div">
                      <Translations text="Network" />
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" component="div">
                      <Translations text="Address" />
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Select
                      value={selectedNetwork}
                      onChange={handleNetworkChange}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="ERC20">ERC20</MenuItem>
                      <MenuItem value="BEP20">BEP20</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleCopyToClipboard(addresses.erc20Address || '')}
                  >
                    {addresses.erc20Address}
                  </TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell>TRC20</TableCell>
                  <TableCell
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleCopyToClipboard(addresses.trc20Address || '')}
                  >
                    {addresses.trc20Address}
                  </TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell>Solana</TableCell>
                  <TableCell
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleCopyToClipboard(addresses.solanaAddress || '')}
                  >
                    {addresses.solanaAddress}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
              <Translations text="Address copied!" />
            </Alert>
          </Snackbar>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DepositView;
