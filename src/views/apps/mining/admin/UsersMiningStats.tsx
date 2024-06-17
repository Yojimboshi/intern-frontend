// src/views/apps/mining/admin/UsersMiningStats.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useMining } from 'src/hooks/useMining';
import { MiningStats } from 'src/types/apps/miningTypes';

const UsersMiningStats = () => {
  const { getAllUserMiningStats } = useMining();
  const [allStats, setAllStats] = useState<MiningStats[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const limit = 50;

  const fetchStats = async (offset: number, limit: number) => {
    setLoading(true);
    const data = await getAllUserMiningStats(limit, offset);
    setLoading(false);
    if (data && data.allStats) {
      setAllStats(prevStats => [...prevStats, ...data.allStats]);
    }
  };

  useEffect(() => {
    fetchStats(0, limit); // Initial fetch
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (offset > 0) {
      fetchStats(offset, limit);
    }
  }, [offset]);

  const handleLoadMore = () => {
    setOffset(prevOffset => prevOffset + limit);
  };

  if (loading && offset === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        All Users Mining Stats
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell align="right">Level</TableCell>
              <TableCell align="right">Hourly Mining Count</TableCell>
              <TableCell align="right">Total Mined</TableCell>
              <TableCell align="right">Total Claimed Rewards</TableCell>
              <TableCell align="right">Last Mining Time</TableCell>
              <TableCell align="right">Penalty Applied</TableCell>
              <TableCell align="right">Date Recorded</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allStats.map((stat) => (
              <TableRow
                key={`${stat.userId}-${stat.dateRecorded}`} // Use combination of userId and dateRecorded as key
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{stat.userId}</TableCell>
                <TableCell>{stat.username}</TableCell>
                <TableCell align="right">{stat.miningBonusPercentage}</TableCell>
                <TableCell align="right">{stat.hourlyMiningRate}</TableCell>
                <TableCell align="right">{stat.totalAmountMined}</TableCell>
                <TableCell align="right">{stat.totalClaimedRewards}</TableCell>
                <TableCell align="right">{new Date(stat.lastMiningTime).toLocaleString()}</TableCell>
                <TableCell align="right">{stat.penaltyApplied ? 'Yes' : 'No'}</TableCell>
                <TableCell align="right">{new Date(stat.dateRecorded).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} textAlign="center">
        <Button variant="contained" color="primary" onClick={handleLoadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      </Box>
    </Box>
  );
};

export default UsersMiningStats;
