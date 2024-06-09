// src/views/apps/mining/admin/MiningTransactions.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useMining } from 'src/hooks/useMining';
import { MiningTransaction } from 'src/types/apps/miningTypes';

const MiningTransactions = () => {
  const { getAllMiningTransactions } = useMining();
  const [transactions, setTransactions] = useState<MiningTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const limit = 50;

  const fetchTransactions = async (offset: number, limit: number) => {
    const data = await getAllMiningTransactions(limit, offset);
    if (data) {
      setTransactions(prevTransactions => [...prevTransactions, ...data]);
    }
  };

  useEffect(() => {
    fetchTransactions(0, limit); // Initial fetch
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (offset > 0) {
      fetchTransactions(offset, limit);
    }
  }, [offset]); // Only run when offset changes

  const handleLoadMore = () => {
    setOffset(prevOffset => prevOffset + limit);
  };

  if (loading && offset === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Mining Transactions
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="mining transactions table">
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell align="right">User ID</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {transaction.id}
                </TableCell>
                <TableCell>{transaction.username}</TableCell>
                <TableCell align="right">{transaction.userId}</TableCell>
                <TableCell align="right">{transaction.amount}</TableCell>
                <TableCell align="right">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell align="right">{transaction.status}</TableCell>
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

export default MiningTransactions;
