// src/views/apps/mining/MiningStats.tsx
import React from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Link } from '@mui/material';
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
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body1">
            View contract interaction on BscScan:
          </Typography>
          <Link href="https://testnet.bscscan.com/address/0x522a1d636C7018b2124a29cd0768374968E8B9D1" target="_blank" rel="noopener">
            https://testnet.bscscan.com/address/0x522a1d636C7018b2124a29cd0768374968E8B9D1
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MiningStats;
