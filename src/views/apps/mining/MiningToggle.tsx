// src/views/apps/mining/MiningToggle.tsx
import React, { useState, useEffect } from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import Icon from 'src/@core/components/icon'
import { useMining } from 'src/hooks/useMining';
import { ThemeColor } from 'src/@core/layouts/types';

const MiningToggle: React.FC = () => {
  const { toggleMining, speedUpMining, getUserMiningStats, loading } = useMining();
  const [isMining, setIsMining] = useState<boolean>(false);
  const [isPenaltyApplicable, setIsPenaltyApplicable] = useState<boolean>(false);

  // Fetch initial mining status
  useEffect(() => {
    const fetchMiningStatusAndPenalty = async () => {
      const stats = await getUserMiningStats();
      setIsMining(stats?.isMining);
      setIsPenaltyApplicable(stats?.penaltyApplied);
    };

    fetchMiningStatusAndPenalty();
  }, []);

  const refreshMiningStatusAndPenalty = async () => {
    const stats = await getUserMiningStats();
    setIsMining(stats?.isMining);
    setIsPenaltyApplicable(stats?.penaltyApplied); // Update based on the latest stats
  };

  const handleToggleMining = async () => {
    await toggleMining();
    await refreshMiningStatusAndPenalty();
  };

  const handleSpeedUpMining = async () => {
    await speedUpMining();
    await refreshMiningStatusAndPenalty();
  };

  let icon;
  if (!isMining) {
    icon = "mdi:speedometer-slow";
  } else if (isPenaltyApplicable) {
    icon = "line-md:speedometer-loop";
  } else {
    icon = "mdi:speedometer";
  }

  const buttonColor: ThemeColor = !isMining ? 'primary' : isPenaltyApplicable ? 'error' : 'warning';

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Button variant="contained" color="primary" onClick={handleToggleMining}>
        {isMining ? 'Stop Mining' : 'Start Mining'}
      </Button>
      <Button
        variant="contained"
        color={buttonColor}
        onClick={handleSpeedUpMining}
        startIcon={<Icon icon={icon} />}
        sx={{ mt: 2 }}
      >
        Speed Up
      </Button>
      <Box my={2}>
        {isMining ? (
          isPenaltyApplicable ? (
            <img src="/images/mining/harvest1.gif" alt="Mining with Penalty" style={{ height: '100px' }} />
          ) : (
            <img src="/images/mining/harvest2.gif" alt="Mining Animation" style={{ height: '100px' }} />
          )
        ) : (
          <img src="/images/mining/harvest0.gif" alt="Mining Paused" style={{ height: '100px' }} />
        )}
      </Box>
    </Box>
  );
};


export default MiningToggle;
