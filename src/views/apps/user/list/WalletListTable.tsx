// src\views\apps\user\list\WalletListTable.tsx
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
import { useTranslation } from 'react-i18next';
import Translations from 'src/layouts/components/Translations';
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import axios from 'src/configs/axiosConfig';
import { CryptoBalance, EwalletBalance, walletBalanceType } from 'src/types/apps/walletTypes';

const getCryptoIcon = (tokenSymbol: string) => {
  return `/images/icons/${tokenSymbol.toUpperCase()}.png`;
};


const walletIcon = 'mdi:wallet';

interface WalletListTableProps {
  cryptoBalances: Array<CryptoBalance>;
  eWalletProfiles: Array<EwalletBalance>;
}

interface CellType {
  row: walletBalanceType
}



const WalletBalanceListTable = ({ cryptoBalances, eWalletProfiles }: WalletListTableProps) => {
  const { t } = useTranslation();
  const [walletData, setWalletData] = useState<Array<{ id: number; name: string; balance: string; }>>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const open = Boolean(anchorEl)

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      field: 'name',
      headerName: t('Name') as string,
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
      headerName: t('Total') as string,
      renderCell: ({ row }: CellType) => <Typography variant='body2'>${row.total || 0}</Typography>
    },
    {
      flex: 0.3,
      minWidth: 125,
      field: 'balance',
      headerName: t('Balance') as string,
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.balance}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: t('Actions') as string,
      renderCell: ({ row }: CellType) => {
        // Check if the row is a cryptocurrency or an eWallet coin
        if (row.isCrypto) {
          // Actions for cryptocurrency
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title={<Translations text="Deposit" />}>
                <IconButton size='small' component={Link} href={`/apps/cryptoWallet/?tab=deposit`}>
                  <Icon icon='fluent-emoji-high-contrast:money-bag' fontSize={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title={<Translations text="Transfer" />}>
                <IconButton size='small' component={Link} href={`/apps/cryptoWallet/?tab=transfer`}>
                  <Icon icon='mdi:bank-transfer' fontSize={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title={<Translations text="Withdraw" />}>
                <IconButton size='small' component={Link} href={`/apps/cryptoWallet/?tab=withdraw`}>
                  <Icon icon='map:atm' fontSize={20} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } else {
          // Actions for eWallet coin
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title={<Translations text="Convert" />}>
                <IconButton size='small' component={Link} href={`/apps/ewalletWallet/?tab=convert`}>
                  <Icon icon='mdi:swap-horizontal' fontSize={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title={<Translations text="Transfer" />}>
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


  useEffect(() => {
    const cryptoBalancesNormalized = cryptoBalances.map(balance => ({
      id: balance.id,
      name: balance.tokenSymbol,
      balance: balance.totalBalance,
      isCrypto: true,
      type: 'Crypto',
    }));

    const ewalletBalancesNormalized = eWalletProfiles.map(balance => ({
      id: balance.id,
      name: balance.ewalletCoin.name,
      balance: balance.balance,
      isCrypto: false,
      type: 'eWallet',
    }));

    const combinedData = [...cryptoBalancesNormalized, ...ewalletBalancesNormalized];
    setWalletData(combinedData);
  }, [cryptoBalances, eWalletProfiles]);

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
