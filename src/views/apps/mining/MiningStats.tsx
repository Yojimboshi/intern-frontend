// src/views/apps/mining/MiningStats.tsx
import React from 'react';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { MiningStatsProps } from 'src/types/apps/miningTypes';

const MiningStats: React.FC<MiningStatsProps> = ({ stats }) => {
  // Check if stats are provided
  const statsAvailable = stats && Object.keys(stats).length > 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Mining Statistics
        </Typography>
        {statsAvailable ? (
          <Box>
            <Typography variant="body1">miningBonusPercentage: {stats.miningBonusPercentage || 'N/A'}</Typography>
            <Typography variant="body1">Hourly Mining Rate: {stats.hourlyMiningRate ? `${stats.hourlyMiningRate} coins` : 'N/A'}</Typography>
            <Typography variant="body1">Total Amount Mined: {stats.totalAmountMined ? `${stats.totalAmountMined} coins` : 'N/A'}</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MiningStats;
