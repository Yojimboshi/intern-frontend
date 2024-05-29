// src\pages\register\complete-registration\activate.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Button, Box, Typography, CircularProgress, Snackbar, Alert
  , Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem
} from '@mui/material';
import { useCrypto } from 'src/hooks/useCrypto';
import axiosInstance from 'src/configs/axiosConfig';
import { UsersType } from 'src/types/apps/userTypes';

const ActivateAccount = () => {
  const router = useRouter();
  const { generateNewAddress, fetchDepositData, loading } = useCrypto();
  const [addresses, setAddresses] = useState({
    erc20Address: '',
    trc20Address: '',
    solanaAddress: ''
  });
  const [userPackage, setUserPackage] = useState<UsersType['package'] | null>(null);
  const [hasAddress, setHasAddress] = useState<boolean | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState('ERC20');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchUserPackage = async () => {
      try {
        const response = await axiosInstance.get<UsersType>('/users/current');
        const userPackage = response.data.package;
        setUserPackage(userPackage || null);
      } catch (error) {
        console.error('Failed to fetch user package:', error);
      }
    };

    const fetchData = async () => {
      try {
        const data = await fetchDepositData();
        setHasAddress(data.hasAddresses);
        if (data.hasAddresses) {
          setAddresses({
            erc20Address: data.erc20Address || '',
            trc20Address: data.trc20Address || '',
            solanaAddress: data.solanaAddress || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch deposit data:', error);
      }
    };

    fetchUserPackage();
    fetchData();
  }, []);


  const handleGenerateAddress = async () => {
    try {
      const newAddresses = await generateNewAddress();
      setAddresses({
        erc20Address: newAddresses.erc20Address || '',
        trc20Address: newAddresses.trc20Address || '',
        solanaAddress: newAddresses.solanaAddress || ''
      });
    } catch (error) {
      console.error('Failed to generate new address:', error);
    }
  };


  const handleActivateAccount = async () => {
    try {
      await axiosInstance.post('/crypto/activate-account', { depositAmount: userPackage?.price });
      router.push('/'); // Redirect to home or another appropriate page after activation
    } catch (error) {
      console.error('Failed to activate account:', error);
    }
  };

  const handleNetworkChange = (event: any) => {
    setSelectedNetwork(event.target.value);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarMessage('Address copied to clipboard!');
      setSnackbarOpen(true);
    }).catch((err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">
        Activate Your Account
      </Typography>
      {userPackage && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Your Package: {userPackage.packageName.toUpperCase()}
        </Typography>
      )}
      {userPackage && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Required Deposit Amount: ${userPackage.price}
        </Typography>
      )}
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {!addresses.erc20Address && !addresses.trc20Address && !addresses.solanaAddress && (
          <Button
            variant="contained"
            onClick={handleGenerateAddress}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Deposit Address'}
          </Button>
        )}
        {(addresses.erc20Address || addresses.trc20Address || addresses.solanaAddress) && (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Network</TableCell>
                  <TableCell>Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>ERC20|BEP20</TableCell>
                  <TableCell
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleCopyToClipboard(addresses.erc20Address || '')}
                  >
                    {addresses.erc20Address}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TRC20</TableCell>
                  <TableCell
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleCopyToClipboard(addresses.trc20Address || '')}
                  >
                    {addresses.trc20Address}
                  </TableCell>
                </TableRow>
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
          </Box>
        )}
        {(addresses.erc20Address || addresses.trc20Address || addresses.solanaAddress) && (
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleActivateAccount}
          >
            Activate Account
          </Button>
        )}
        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 1 }}
          onClick={() => router.push('/register/complete-registration')}
        >
          Back
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActivateAccount;
