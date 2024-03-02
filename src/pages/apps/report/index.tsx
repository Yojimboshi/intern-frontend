// src\pages\apps\report\index.tsx
import React from 'react';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import PageHeader from 'src/@core/components/page-header'
import TransactionTable from 'src/views/apps/report/TransactionTable';
import RoleCards from 'src/views/apps/report/RoleCards'
import Translations from 'src/layouts/components/Translations';

const ReportComponents = () => {
  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'><Translations text='Roles List' /></Typography>}
        subtitle={<Typography variant='body2'>
          <Translations text='A role provides access to predefined menus and features depending on assigned role.' />
        </Typography>}
      />
      <Grid item xs={12} sx={{ mb: 5 }}>
        <RoleCards />
      </Grid>
      <PageHeader
        title={<Typography variant='h5'><Translations text='Transactions Report' /></Typography>}
        subtitle={<Typography variant='body2'>
          <Translations text='View and manage all user transactions here.' />
        </Typography>}
      />
      <Grid item xs={12}>
        <TransactionTable />
      </Grid>
    </Grid>
  );
};

export default ReportComponents;
