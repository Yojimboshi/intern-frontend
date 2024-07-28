// src\pages\apps\cryptoWallet\index.tsx
import React, { useState, useEffect } from 'react';
import DepositView from 'src/views/apps/wallet/cryptoWallet/deposit';
import WithdrawView from 'src/views/apps/wallet/cryptoWallet/withdraw';
import TransferView from 'src/views/apps/wallet/cryptoWallet/transfer';
import { useCrypto } from 'src/hooks/useCrypto';
import { Grid, ButtonGroup, Button, Typography, } from '@mui/material';
import Icon from 'src/@core/components/icon'
import Translations from 'src/layouts/components/Translations';
import { useRouter } from 'next/router';


const CryptoWallet = () => {
  const router = useRouter();
  const { tab } = router.query;
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>(tab as any || 'deposit');
  const { fetchDepositData, generateNewAddress, } = useCrypto();
  const [hasAddress, setHasAddress] = useState<boolean | null>(null);
  const [addresses, setAddresses] = useState<{
    erc20Address?: string,
    // trc20Address?: string,
    solanaAddress?: string
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDepositData();
        setHasAddress(data.hasAddresses);
        if (data.hasAddresses) {
          setAddresses({
            erc20Address: data.erc20Address || null,
            // trc20Address: data.trc20Address || null,
            solanaAddress: data.solanaAddress || null,
          });
        }
      } catch (error) {
        // Handle or log the error as you see fit
        console.error("Failed to fetch deposit data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Update local state when URL changes
    if (tab) {
      setActiveTab(tab as any);
    }
  }, [tab]);

  const handleTabChange = (newTab: 'deposit' | 'withdraw' | 'transfer') => {
    // Update the URL
    router.replace(`/apps/wallet/cryptoWallet/?tab=${newTab}`, undefined, { shallow: true });
  };

  const handleGenerateAddressClick = async () => {
    // Call the API to generate a new crypto address for the user
    const newAddresses = await generateNewAddress();

    const hasGeneratedAnyAddress = newAddresses.erc20Address || newAddresses.trc20Address || newAddresses.solanaAddress ? true : false;
    if (hasGeneratedAnyAddress) {
      // Set the new addresses in the local state
      setAddresses({
        erc20Address: newAddresses.erc20Address || null, // Fallback to null if not present
        // trc20Address: newAddresses.trc20Address || null, // Fallback to null if not present
        solanaAddress: newAddresses.solanaAddress || null, // Fallback to null if not present
      });

      // Update the hasAddress state to true
      setHasAddress(true);
    }
  };

  const getButtonColor = (tabName: any) => {
    // If the active tab is the current tab, use the themeColor from settings
    // Otherwise, use a color that indicates an inactive state
    return activeTab === tabName ? 'primary' : 'secondary';
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          <Icon icon="carbon:ibm-cloud-hyper-protect-crypto-services" />
          <Translations text="Crypto Wallet" /> {/* Translate the title */}
        </Typography>
        <ButtonGroup variant="contained" fullWidth>
          <Button onClick={() => handleTabChange('deposit')} color={getButtonColor('deposit')}>
            <Translations text="Deposit" /> {/* Translate the button label */}
          </Button>
          <Button onClick={() => handleTabChange('transfer')} color={getButtonColor('transfer')}>
            <Translations text="Transfer" /> {/* Translate the button label */}
          </Button>
          <Button onClick={() => handleTabChange('withdraw')} color={getButtonColor('withdraw')}>
            <Translations text="Withdraw" /> {/* Translate the button label */}
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12}>
        {activeTab === 'deposit' && (
          <DepositView addresses={addresses} hasAddress={hasAddress} onGenerateAddress={handleGenerateAddressClick} />
        )}
        {activeTab === 'withdraw' && <WithdrawView />}
        {activeTab === 'transfer' && <TransferView />}
      </Grid>
    </Grid>
  );
};

export default CryptoWallet;
