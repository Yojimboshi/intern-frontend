// src/views/apps/mining/admin/UsersMiningStats.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useMining } from 'src/hooks/useMining';
import { MiningStats } from 'src/types/apps/miningTypes';

const UsersMiningStats = () => {
  const { getAllUserMiningStats, loading } = useMining();
  const [allStats, setAllStats] = useState<MiningStats[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllUserMiningStats();
      setAllStats(data || []);
    };

    fetchData();
  }, []);

  if (loading) {
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
              <TableCell align="right">Hourly Mining Rate</TableCell>
              <TableCell align="right">Total Amount Mined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allStats.map((stat) => (
              <TableRow
                key={stat.userId} // Use userId as key for uniqueness
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{stat.userId}</TableCell>
                <TableCell>{stat.username}</TableCell>
                <TableCell align="right">{stat.level}</TableCell>
                <TableCell align="right">{stat.hourlyMiningRate}</TableCell>
                <TableCell align="right">{stat.totalAmountMined}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsersMiningStats;
