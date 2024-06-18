// ** React Imports
import React, { MouseEvent, useState, useEffect } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { walletBalanceType } from 'src/types/apps/invoiceTypes'
import CustomAvatar from 'src/@core/components/mui/avatar'
import axios from 'src/configs/axiosConfig';
import { CryptoBalance, EwalletBalance } from 'src/types/apps/walletTypes';

const getCryptoIcon = (tokenSymbol: string) => {
  return `/images/icons/${tokenSymbol.toUpperCase()}.png`;
};


const walletIcon = 'mdi:wallet';


interface CellType {
  row: walletBalanceType
}

const columns: GridColDef[] = [
  {
    flex: 0.25,
    field: 'name',
    headerName: 'Name',
    minWidth: 100,
    renderCell: ({ row }) => <Typography variant='body2'>{row.name}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 80,
    field: 'type',
    headerName: 'Type',
    sortable: true,
    filterable: true,
    renderCell: ({ row }) => {
      const iconPath = row.isCrypto ? getCryptoIcon(row.name) : '/images/icons/default-icon.png'; // Adjust the default icon path as needed

      return (
        <Tooltip title={`Type: ${row.type}`}>
          <CustomAvatar skin='light' color='primary' sx={{ width: '1.875rem', height: '1.875rem' }}>
            <img
              src={iconPath}
              alt={row.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </CustomAvatar>
        </Tooltip>
      );
    }
  },
  {
    flex: 0.25,
    minWidth: 90,
    field: 'total',
    headerName: 'Total',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>${row.total || 0}</Typography>
  },
  {
    flex: 0.3,
    minWidth: 125,
    field: 'balance',
    headerName: 'Balance',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.balance}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 130,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => {
      // Check if the row is a cryptocurrency or an eWallet coin
      if (row.isCrypto) {
        // Actions for cryptocurrency
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Deposit'>
              <IconButton size='small' component={Link} href={`/apps/wallet/cryptoWallet/?tab=deposit`}>
                <Icon icon='mdi:bank-plus' fontSize={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Transfer'>
              <IconButton size='small' component={Link} href={`/apps/wallet/cryptoWallet/?tab=transfer`}>
                <Icon icon='mdi:bank-transfer' fontSize={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Withdraw'>
              <IconButton size='small' component={Link} href={`/apps/wallet/cryptoWallet/?tab=withdraw`}>
                <Icon icon='mdi:bank-remove' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      } else {
        // Actions for eWallet coin
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Convert'>
              <IconButton size='small' component={Link} href={`/apps/ewalletWallet/?tab=convert`}>
                <Icon icon='mdi:swap-horizontal' fontSize={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Transfer'>
              <IconButton size='small' component={Link} href={`/apps/ewalletWallet/?tab=transfer`}>
                <Icon icon='mdi:bank-transfer' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      }
    }
  }
]

const WalletBalanceListTable = () => {
  const [walletData, setWalletData] = useState<Array<{ id: number; name: string; balance: string; }>>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  const open = Boolean(anchorEl)

  useEffect(() => {
    const fetchWalletBalances = async () => {
      try {
        const response = await axios.get('/ewallet/wallet/balances');
        if (response.data) {
          // Normalize CryptoBalance and EwalletBalance into a single format
          const cryptoBalancesNormalized = response.data.cryptoBalances.map((balance: CryptoBalance) => ({
            name: balance.tokenSymbol,
            balance: balance.totalBalance,
            isCrypto: true,
            type: 'Crypto',
          }));

          const ewalletBalancesNormalized = response.data.ewalletBalances.map((balance: EwalletBalance) => ({
            name: balance.ewalletCoin.name,
            balance: balance.balance,
            isCrypto: false,
            type: 'eWallet',
          }));

          // Combine and set the normalized data
          const combinedData = [...cryptoBalancesNormalized, ...ewalletBalancesNormalized];
          console.log('walletData before setWalletData:', combinedData);
          setWalletData(combinedData);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching wallet balances:', error);
      }
    };
    fetchWalletBalances();
  }, []);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Card>
      <CardHeader
        title='Wallet Balances'
        sx={{ '& .MuiCardHeader-action': { m: 0 } }}
        action={
          <>
            <Button
              variant='contained'
              aria-haspopup='true'
              onClick={handleClick}
              aria-expanded={open ? 'true' : undefined}
              endIcon={<Icon icon='mdi:chevron-down' />}
              aria-controls={open ? 'user-view-overview-export' : undefined}
            >
              Export
            </Button>
            <Menu open={open} anchorEl={anchorEl} onClose={handleClose} id='user-view-overview-export'>
              <MenuItem onClick={handleClose}>PDF</MenuItem>
              <MenuItem onClick={handleClose}>XLSX</MenuItem>
              <MenuItem onClick={handleClose}>CSV</MenuItem>
            </Menu>
          </>
        }
      />
      <DataGrid
        autoHeight
        columns={columns}
        getRowId={(row) => row.name}
        rows={walletData}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
      />
    </Card>
  )
}

export default WalletBalanceListTable
