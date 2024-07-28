// src\pages\apps\wallet\eWallet\index.tsx
import React, { useState, useEffect } from 'react';
import { Grid, ButtonGroup, Button, Typography } from '@mui/material';
import Icon from 'src/@core/components/icon'
import DepositView from 'src/views/apps/wallet/eWallet/deposit';
import TransferView from 'src/views/apps/wallet/eWallet/transfer';
import ConvertView from 'src/views/apps/wallet/eWallet/convert';
import Translations from 'src/layouts/components/Translations';
import { ICoin } from 'src/types/apps/coinTypes';
import { useRouter } from 'next/router';
import { useEWallet } from 'src/hooks/useEWallet';

type Tab = 'deposit' | 'transfer' | 'convert';

const EWallet = () => {
  const router = useRouter();
  const { tab } = router.query;
  const [activeTab, setActiveTab] = useState<Tab>('deposit');
  const [coins, setCoins] = useState<ICoin[]>([]);
  const { getAvailableCoins } = useEWallet();

  useEffect(() => {
    // Fetch available coins on component mount
    const fetchCoins = async () => {
      const availableCoins = await getAvailableCoins();
      setCoins(availableCoins);
      console.log("availableCoins", availableCoins);
    };

    fetchCoins();
  }, [getAvailableCoins]);

  useEffect(() => {
    if (typeof tab === 'string' && ['deposit', 'transfer', 'convert'].includes(tab)) {
      setActiveTab(tab as Tab);
    }
  }, [tab]);

  const getButtonColor = (tabName: Tab) => activeTab === tabName ? 'primary' : 'secondary';

  const TabButton = ({ name }: { name: Tab }) => (
    <Button onClick={() => setActiveTab(name)} color={getButtonColor(name)}>
      <Translations text={name.charAt(0).toUpperCase() + name.slice(1)} />
    </Button>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          <Icon icon="bx:coin" />
          <Translations text="E-Wallet" />
        </Typography>
        <ButtonGroup variant="contained" fullWidth>
          <TabButton name="deposit" />
          <TabButton name="transfer" />
          <TabButton name="convert" />
        </ButtonGroup>
      </Grid>
      <Grid item xs={12}>
        {activeTab === 'deposit' && <DepositView coins={coins} />}
        {activeTab === 'transfer' && <TransferView />}
        {activeTab === 'convert' && <ConvertView />}
      </Grid>
    </Grid>
  );
};

export default EWallet;
