// src\pages\register\complete-registration\activate.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Button, Box, Typography, CircularProgress, Snackbar, Alert, Avatar
  , Table, TableBody, TableCell, TableHead, TableRow, Tooltip
} from '@mui/material';
import Icon from 'src/@core/components/icon'
import { useCrypto } from 'src/hooks/useCrypto';
import axios from 'axios';
import axiosInstance from 'src/configs/axiosConfig';
import { useEWallet } from 'src/hooks/useEWallet';
import { CryptoBalance } from 'src/types/apps/walletTypes';
import { UsersType } from 'src/types/apps/userTypes';

const ActivateAccount = () => {
  const router = useRouter();
  const { generateNewAddress, fetchDepositData } = useCrypto();
  const [addresses, setAddresses] = useState({
    erc20Address: '',
    trc20Address: '',
    solanaAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [userPackage, setUserPackage] = useState<UsersType['package'] | null>(null);
  const { getUserBalances } = useEWallet();
  const [usdtBalance, setUsdtBalance] = useState<CryptoBalance | null>(null);
  const [dragonBalance, setDragonBalance] = useState<CryptoBalance | null>(null);
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

    const fetchBalances = async () => {
      try {
        const response = await getUserBalances();
        const mappedBalances = response.cryptoBalances.map((item: CryptoBalance) => ({
          ...item,
          fullName: item.tokenSymbol,
          icon: getIconFromSymbol(item.tokenSymbol),
        }));
        const usdtData = mappedBalances.find((item: CryptoBalance) => item.tokenSymbol === 'USDT');
        const dragonData = mappedBalances.find((item: CryptoBalance) => item.tokenSymbol === 'DRAGON');
        setUsdtBalance(usdtData || null);
        setDragonBalance(dragonData || null);
      } catch (error) {
        console.error('Failed to fetch balances:', error);
      }
    };

    fetchUserPackage();
    fetchData();
    fetchBalances();

    console.log("usdtBalance", usdtBalance);
    console.log("dragonBalance", dragonBalance);
  }, [getUserBalances]);


  const getIconFromSymbol = (tokenSymbol: string) => {
    const icons: { [key: string]: string } = {
      BTC: 'currency-btc',
      ETH: 'ethereum',
      USDT: 'currency-usd-circle',
      DRAGON: 'dragon', // Assuming 'dragon' is available in the icon set
      DAI: 'currency-usd',
    };

    return `mdi-${icons[tokenSymbol.toUpperCase()] || 'coin'}`;
  };


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
    setLoading(true);
    try {
      await axiosInstance.post('/crypto/activate-account', { depositAmount: userPackage?.price });
      setSnackbarMessage('Account activated successfully!');
      setSnackbarOpen(true);
      router.push('/');
    } catch (error) {
      console.error('Failed to activate account:', error);
      if (axios.isAxiosError(error) && error.response?.status === 400 && error.response?.data?.message) {
        setSnackbarMessage(error.response.data.message);
      } else {
        setSnackbarMessage('Failed to activate account');
      }
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
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
      {usdtBalance && (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Tooltip title={`USDT: ${Number(usdtBalance.totalBalance).toFixed(4)}`} arrow>
            <Avatar
              sx={{
                bgcolor: 'secondary.main',
                width: 56,
                height: 56,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Icon icon={usdtBalance.icon} />
            </Avatar>
          </Tooltip>
          <Typography variant="h6" sx={{ ml: 2 }}>
            {String(usdtBalance.tokenSymbol)}
            ${Number(usdtBalance.totalBalance).toFixed(4)}
          </Typography>
        </Box>
      )}
      {dragonBalance && (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Tooltip title={`DRAGON: ${Number(dragonBalance.totalBalance).toFixed(4)}`} arrow>
            <Avatar
              sx={{
                bgcolor: 'secondary.main',
                width: 56,
                height: 56,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Icon icon={dragonBalance.icon} />
            </Avatar>
          </Tooltip>
          <Typography variant="h6" sx={{ ml: 2 }}>
            {String(dragonBalance.tokenSymbol)}
            ${Number(dragonBalance.totalBalance).toFixed(4)}
          </Typography>
        </Box>
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
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarMessage.includes('successfully') ? "success" : "error"}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActivateAccount;
