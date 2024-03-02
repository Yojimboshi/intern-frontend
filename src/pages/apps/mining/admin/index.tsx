// src/pages/apps/mining/admin/index.tsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Tab, Tabs } from '@mui/material';
import { useMining } from 'src/hooks/useMining';
import UsersMiningStats from 'src/views/apps/mining/admin/UsersMiningStats';
import MiningTransactions from 'src/views/apps/mining/admin/MiningTransactions';

const AdminMiningPage = () => {
  const [value, setValue] = useState(0);
  const { loading } = useMining(); // Assuming useMining hook might provide some admin-specific data fetching methods in the future

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Admin Mining Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="admin mining tabs">
          <Tab label="User Stats" />
          <Tab label="Transactions" />
        </Tabs>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {value === 0 && <UsersMiningStats />}
          {value === 1 && <MiningTransactions />}
        </>
      )}
    </Container>
  );
};

export default AdminMiningPage;
