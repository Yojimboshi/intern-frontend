// src\views\apps\report\TableHeader.tsx
import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Icon from 'src/@core/components/icon'

interface TableHeaderProps {
  selectedType: string;
  handleTypeChange: (event: SelectChangeEvent) => void;
  searchQuery: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRefresh: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  selectedType,
  handleTypeChange,
  searchQuery,
  handleSearchChange,
  handleRefresh
}) => {
  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={searchQuery}
          placeholder='Search Transactions'
          sx={{ mr: 6, mb: 2 }}
          onChange={handleSearchChange}
        />
        <FormControl size='small' sx={{ mr: 6, mb: 2 }}>
          <InputLabel id='transaction-type-select-label'>Transaction Type</InputLabel>
          <Select
            size='small'
            value={selectedType}
            id='select-transaction-type'
            label='Transaction Type'
            labelId='transaction-type-select-label'
            onChange={handleTypeChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="ewallet">E-Wallet</MenuItem>
            <MenuItem value="crypto">Crypto</MenuItem>
            <MenuItem value="v2Pool">V2 Pool</MenuItem>
            <MenuItem value="upgradeHistory">Upgrade History</MenuItem>
            <MenuItem value="activeBonus">Active Bonus</MenuItem>
            <MenuItem value="passiveBonus">Passive Bonus</MenuItem>
            <MenuItem value="registeredUsers">Registered Users</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button
        size="small"
        variant="contained"
        startIcon={<Icon icon="material-symbols:refresh" />}
        onClick={handleRefresh}
        sx={{ mb: 2 }}
      >
        Refresh
      </Button>
    </Box>
  );
};

export default TableHeader;
