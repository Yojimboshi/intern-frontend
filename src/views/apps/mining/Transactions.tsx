// src/views/apps/mining/Transactions.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useMining } from 'src/hooks/useMining';
import { MiningTransaction } from 'src/types/apps/miningTypes';

const Transactions = () => {
  const { getMiningTransactions } = useMining();
  const [transactions, setTransactions] = useState<MiningTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const limit = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const data = await getMiningTransactions(undefined, limit, offset);
      setLoading(false);
      if (data) {
        const parsedTransactions: MiningTransaction[] = data.map(transaction => ({
          ...transaction,
          id: Number(transaction.id),
          userId: Number(transaction.userId),
          amount: parseFloat(transaction.amount).toFixed(10),
        }));
        setTransactions(prevTransactions => [...prevTransactions, ...parsedTransactions]);
      }
    };

    fetchTransactions();
  }, [offset]); // Only depend on offset to prevent infinite loop

  const handleLoadMore = () => {
    setOffset(prevOffset => prevOffset + limit);
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell component="th" scope="row">{transaction.id}</TableCell>
                <TableCell align="right">{transaction.amount}</TableCell>
                <TableCell align="right">{new Date(transaction.date).toLocaleString()}</TableCell>
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

export default Transactions;
