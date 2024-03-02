// src/views/apps/mining/admin/MiningTransactions.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useMining } from 'src/hooks/useMining';
import { MiningTransaction } from 'src/types/apps/miningTypes';

const MiningTransactions = () => {
  const { getAllMiningTransactions, loading } = useMining();
  const [transactions, setTransactions] = useState<MiningTransaction[]>([]);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      const transactionsData = await getAllMiningTransactions(); // Directly using the returned array
      setTransactions(transactionsData); // No need to check for data.transactions
    };

    fetchAllTransactions();
  }, []);

  if (loading) {
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
                <TableCell align="right">{transaction.userId}</TableCell>
                <TableCell align="right">{transaction.amount}</TableCell>
                <TableCell align="right">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell align="right">{transaction.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MiningTransactions;
