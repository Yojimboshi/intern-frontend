// src\pages\apps\mining\index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Button, Typography, CircularProgress, Box } from '@mui/material';
import Icon from 'src/@core/components/icon'
import Translations from 'src/layouts/components/Translations';
import { useRouter } from 'next/router';
import { useMining } from 'src/hooks/useMining';
import MiningToggle from 'src/views/apps/mining/MiningToggle';
import MiningStats from 'src/views/apps/mining/MiningStats';
import Transactions from 'src/views/apps/mining/Transactions';

const MiningPage = () => {
  const { toggleMining, getUserMiningStats, loading } = useMining();
  const [miningStats, setMiningStats] = useState<any>(null);
  const [view, setView] = useState<'stats' | 'transactions'>('stats');

  useEffect(() => {
    const fetchMiningStats = async () => {
      if (view === 'stats') {
        const stats = await getUserMiningStats();
        setMiningStats(stats);
      }
    };
    fetchMiningStats();
  }, [view]);


  const handleToggleMining = async () => {
    await toggleMining();
    // Conditional fetching moved inside the function
    if (view === 'stats') {
      const stats = await getUserMiningStats();
      setMiningStats(stats);
    }
  };

  const handleToggleView = (newView: 'stats' | 'transactions') => {
    setView(newView);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>Mining Dashboard</Typography>
        <MiningToggle />
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-around" my={2}>
          <Button variant={view === 'stats' ? 'contained' : 'outlined'} onClick={() => handleToggleView('stats')}>View Stats</Button>
          <Button variant={view === 'transactions' ? 'contained' : 'outlined'} onClick={() => handleToggleView('transactions')}>View Transactions</Button>
        </Box>
      </Grid>
      {view === 'stats' && miningStats && (
        <Grid item xs={12}>
          <MiningStats stats={miningStats} />
        </Grid>
      )}
      {view === 'transactions' && (
        <Grid item xs={12}>
          <Transactions />
        </Grid>
      )}
    </Grid>
  );
};

export default MiningPage;
