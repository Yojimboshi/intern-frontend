// src/views/apps/mining/Transactions.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useMining } from 'src/hooks/useMining';
import { MiningTransaction } from 'src/types/apps/miningTypes';

const Transactions = () => {
  const { getMiningTransactions } = useMining();
  const [transactions, setTransactions] = useState<MiningTransaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getMiningTransactions();
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  return (
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
              <TableCell align="right">{transaction.date}</TableCell>
              <TableCell align="right">{transaction.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Transactions;
