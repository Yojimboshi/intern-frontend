// src\pages\register\complete-registration\activate.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { useCrypto } from 'src/hooks/useCrypto';
import axiosInstance from 'src/configs/axiosConfig';
import { UsersType } from 'src/types/apps/userTypes';

const ActivateAccount = () => {
  const router = useRouter();
  const { generateNewAddress, loading } = useCrypto();
  const [addresses, setAddresses] = useState({
    erc20Address: '',
    trc20Address: '',
    solanaAddress: ''
  });
  const [userPackage, setUserPackage] = useState<UsersType['package'] | null>(null);

  useEffect(() => {
    const fetchUserPackage = async () => {
      try {
        const response = await axiosInstance.get<UsersType>('/user/current');
        const userPackage = response.data.package;
        setUserPackage(userPackage || null);
      } catch (error) {
        console.error('Failed to fetch user package:', error);
      }
    };

    fetchUserPackage();
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
          <Box sx={{ mt: 2 }}>
            {addresses.erc20Address && <Typography>ERC20 Address: {addresses.erc20Address}</Typography>}
            {addresses.trc20Address && <Typography>TRC20 Address: {addresses.trc20Address}</Typography>}
            {addresses.solanaAddress && <Typography>Solana Address: {addresses.solanaAddress}</Typography>}
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
    </Box>
  );
};

export default ActivateAccount;
