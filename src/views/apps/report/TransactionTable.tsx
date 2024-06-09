// src\views\apps\report\TransactionTable.tsx
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Card from '@mui/material/Card';
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { SelectChangeEvent } from '@mui/material/Select'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions } from 'src/store/apps/transaction';
import { RootState, AppDispatch } from 'src/store'
import {
  EwalletTransactionType,
  CryptoTransactionType,
  v2PoolTransactionType,
  UpgradeHistoryType,
  ActiveBonusTransactionType,
  PassiveBonusTransactionType,
  RegisteredUserTransactionType
} from 'src/types/apps/transactionTypes';

// ** Custom Components Imports
import TableHeader from 'src/views/apps/report/TableHeader';

const getColumnsForType = (type: string): GridColDef[] => {
  switch (type) {
    case 'activeBonus':
      return [
        { field: 'userId', headerName: 'User ID', width: 100 },
        { field: 'bonusType', headerName: 'Bonus Type', width: 150 },
        { field: 'amount', headerName: 'Amount', width: 120 },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'transactionType', headerName: 'Transaction Type', width: 150 },
      ];
    case 'passiveBonus':
      return [
        { field: 'userId', headerName: 'User ID', width: 100 },
        { field: 'packageName', headerName: 'Package Name', width: 150 },
        { field: 'amount', headerName: 'Amount', width: 120 },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'bonusPercentage', headerName: 'Bonus Percentage', width: 120 },
      ];
    case 'ewallet':
      return [
        { field: 'userId', headerName: 'User ID', width: 100 },
        { field: 'coinId', headerName: 'Coin ID', width: 100 },
        { field: 'type', headerName: 'Type', width: 120 },
        { field: 'status', headerName: 'Status', width: 110 },
        { field: 'amount', headerName: 'Amount', width: 120 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'date', headerName: 'Date', width: 150 },
      ];
    case 'crypto':
      return [
        { field: 'userId', headerName: 'User ID', width: 100 },
        { field: 'type', headerName: 'Type', width: 120 },
        { field: 'currency', headerName: 'Currency', width: 120 },
        { field: 'amount', headerName: 'Amount', width: 120 },
        { field: 'status', headerName: 'Status', width: 110 },
      ];
    case 'upgradeHistory':
      return [
        { field: 'oldPackageId', headerName: 'Old Package ID', width: 120 },
        { field: 'newPackageId', headerName: 'New Package ID', width: 120 },
        { field: 'upgradeDate', headerName: 'Upgrade Date', width: 150 },
      ];
    case 'v2Pool':
      return [
        { field: 'userId', headerName: 'User ID', width: 100 },
        { field: 'tokenA', headerName: 'Token A', width: 120 },
        { field: 'tokenB', headerName: 'Token B', width: 120 },
        { field: 'type', headerName: 'Type', width: 120 },
        { field: 'tokenASpent', headerName: 'Token A Spent', width: 120 },
        { field: 'tokenBSpent', headerName: 'Token B Spent', width: 120 },
        { field: 'tokenAReceived', headerName: 'Token A Received', width: 120 },
        { field: 'tokenBReceived', headerName: 'Token B Received', width: 120 },
        { field: 'lpTokensMinted', headerName: 'LP Tokens Minted', width: 120 },
        { field: 'lpTokensBurned', headerName: 'LP Tokens Burned', width: 120 },
        { field: 'date', headerName: 'Date', width: 150 },
      ];
    case 'registeredUsers':
      return [
        { field: 'id', headerName: 'User ID', width: 100 },
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'createdAt', headerName: 'Registration Date', width: 150 },
      ];
    default:
      return [
        { field: 'col1', headerName: 'Column 1', width: 150 },
        { field: 'col2', headerName: 'Column 2', width: 150 },
        { field: 'col3', headerName: 'Column 3', width: 150 },
        { field: 'col4', headerName: 'Column 4', width: 150 },
        { field: 'col5', headerName: 'Column 5', width: 150 },
      ];
  }
};

const TransactionTable = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [transactionType, setTransactionType] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })
  const dispatch = useDispatch<AppDispatch>();

  const transactions = useSelector((state: RootState) => {
    switch (selectedType) {
      case 'ewallet':
        return state.transaction.ewallet as EwalletTransactionType[];
      case 'crypto':
        return state.transaction.crypto as CryptoTransactionType[]
      case 'v2Pool':
        return state.transaction.v2Pool as v2PoolTransactionType[];
      case 'upgradeHistory':
        return state.transaction.upgradeHistory as UpgradeHistoryType[];
      case 'activeBonus':
        return state.transaction.activeBonus as ActiveBonusTransactionType[];
      case 'passiveBonus':
        return state.transaction.passiveBonus as PassiveBonusTransactionType[];
      case 'registeredUsers':
        return state.transaction.registeredUsers as RegisteredUserTransactionType[];
      default:
        return [];
    }
  });

  useEffect(() => {
    if (transactionType) {
      dispatch(fetchTransactions({ type: transactionType, page: paginationModel.page, pageSize: paginationModel.pageSize }))
    }
  }, [dispatch, transactionType, paginationModel.page, paginationModel.pageSize])


  const handleTypeChange = (event: SelectChangeEvent) => {
    const newType = event.target.value as string;
    setTransactionType(newType);
    setSelectedType(newType);
    setPaginationModel({ page: 0, pageSize: 100 });
  };


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilter = useCallback((val: string) => {
    setSearchQuery(val);
  }, []);

  const handleRefresh = () => {
    if (selectedType) {
      dispatch(fetchTransactions({
        type: selectedType,
        page: paginationModel.page,
        pageSize: paginationModel.pageSize
      })).catch((error) => {
        console.error("Error in fetchTransactions:", error);
      });
    }
  };

  const columns = getColumnsForType(transactionType)

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) {
      return transactions;
    }
    const query = searchQuery.toLowerCase();
    return transactions.filter(transaction => {
      // Modify this based on the fields you want to search
      return Object.values(transaction).some(value =>
        String(value).toLowerCase().includes(query)
      );
    });
  }, [transactions, searchQuery]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id="transaction-type-select-label">Transaction Type</InputLabel>
          <Select
            labelId='transaction-type-label'
            id='transaction-type-select'
            value={transactionType}
            label='Transaction Type'
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
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            selectedType={selectedType}
            handleTypeChange={handleTypeChange}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            handleRefresh={handleRefresh}
          />
          <DataGrid
            autoHeight
            rows={filteredTransactions || []}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default TransactionTable
