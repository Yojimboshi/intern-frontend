// src\pages\apps\user\list\index.tsx
import { useState, useEffect, MouseEvent, useCallback } from 'react'
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'
import { getInitials } from 'src/@core/utils/get-initials'
import { fetchData, toggleBanStatus } from 'src/store/apps/user'
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import UserViewDetail from 'src/views/apps/user/list/UserViewDetail';
import { useTranslation } from 'react-i18next';
import Translations from 'src/layouts/components/Translations'

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

interface UserStatusType {
  [key: string]: ThemeColor
}


// ** Vars
const userRoleObj: UserRoleType = {
  admin: { icon: 'mdi:laptop', color: 'error.main' },
  member: { icon: 'mdi:account-outline', color: 'primary.main' },

  // author: { icon: 'mdi:cog-outline', color: 'warning.main' },
  // editor: { icon: 'mdi:pencil-outline', color: 'info.main' },
  // maintainer: { icon: 'mdi:chart-donut', color: 'success.main' },
  // subscriber: { icon: 'mdi:account-outline', color: 'primary.main' }
}

interface CellType {
  row: UsersType
}

const userStatusObj: UserStatusType = {
  active: 'success',
  restricted: 'warning',
  banned: 'secondary'
}


// ** renders client column
const renderClient = (row: UsersType) => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(row.fullName ? row.fullName : '')}
      </CustomAvatar>
    )
  }
}

const RowOptions = ({ id }: { id: number | string }) => {
  const { t } = useTranslation();

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [anchorElBan, setAnchorElBan] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)
  const banMenuOpen = Boolean(anchorElBan)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
    setAnchorElBan(null)
  }

  const handleBanMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorElBan(event.currentTarget)
  }

  const handleBanStatus = (action: 'ban' | 'restrict' | 'activate') => {
    dispatch(toggleBanStatus({ id, action }))
    setAnchorElBan(null)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href={`/apps/user/list/${id}`}
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          {t('View')}
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          {t('Edit')}
        </MenuItem>
        <MenuItem onClick={handleBanMenuOpen} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:account-outline' fontSize={20} />
          {t('Ban Status')}
        </MenuItem>
      </Menu>
      {/* Nested Ban Menu */}
      <Menu
        keepMounted
        open={banMenuOpen}
        anchorEl={anchorElBan}
        onClose={() => setAnchorElBan(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleBanStatus('ban')}>{t('Ban')}</MenuItem>
        <MenuItem onClick={() => handleBanStatus('restrict')}>{t('Restrict')}</MenuItem>
        <MenuItem onClick={() => handleBanStatus('activate')}>{t('Activate')}</MenuItem>
      </Menu>
    </>
  )
}

const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<UsersType | null>(null);

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)

  useEffect(() => {
    console.log("useEffect refetch data...")
    dispatch(
      fetchData({
        role,
        status,
        q: value,
        currentPlan: plan
      })
    )
  }, [dispatch, plan, role, status, value])



  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'fullName',
      headerName: t('User') as string,
      renderCell: ({ row }: CellType) => {
        const { username } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => handleUserClick(row)}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography noWrap variant='caption'>
                {`@${username}`}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'email',
      headerName: t('Email') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.email}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'role',
      minWidth: 150,
      headerName: t('Role') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3, color: userRoleObj[row.role].color } }}>
            <Icon icon={userRoleObj[row.role].icon} fontSize={20} />
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.role}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('Plan') as string,
      field: 'currentPlan',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
            {row.currentPlan}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: t('Status') as string,
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={row.status}
            color={userStatusObj[row.status]}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: t('Action') as string,
      renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
    }
  ]


  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback((e: SelectChangeEvent) => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback((e: SelectChangeEvent) => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setStatus(e.target.value)
  }, [])

  const handleUserClick = (userData: UsersType) => {
    setSelectedUserData(userData);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setSelectedUserData(null);
    setOpenDialog(false);
  };

  // Pass down handleUserClick to RowOptions
  // const handleEditOptionClick = (id: string | number) => {
  //   const userData = store.data.find(user => user.id === id);
  //   if (userData) {
  //     handleUserClick(userData);
  //   }
  // };

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontal.map((item: CardStatsHorizontalProps, index: number) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon as string} />} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={<Translations text='Search Filters' />} sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='role-select'><Translations text='Select Role' /></InputLabel>
                  <Select
                    fullWidth
                    value={role}
                    id='select-role'
                    label={<Translations text='Select Role' />}
                    labelId='role-select'
                    onChange={handleRoleChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''><Translations text='Select Role' /></MenuItem>
                    <MenuItem value='admin'><Translations text='Admin' /></MenuItem>
                    <MenuItem value='member'><Translations text='Member' /></MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='plan-select'><Translations text='Select Plan' /></InputLabel>
                  <Select
                    fullWidth
                    value={plan}
                    id='select-plan'
                    label={<Translations text='Select Plan' />}
                    labelId='plan-select'
                    onChange={handlePlanChange}
                    inputProps={{ placeholder: 'Select Plan' }}
                  >
                    <MenuItem value=''><Translations text='Select Plan' /></MenuItem>
                    <MenuItem value='1'><Translations text='V1' /></MenuItem>
                    <MenuItem value='2'><Translations text='V2' /></MenuItem>
                    <MenuItem value='3'><Translations text='V3' /></MenuItem>
                    <MenuItem value='4'><Translations text='V4' /></MenuItem>
                    <MenuItem value='5'><Translations text='V5' /></MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='status-select'><Translations text='Select Status' /></InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    id='select-status'
                    label={<Translations text='Select Status' />}
                    labelId='status-select'
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''><Translations text='Select Role' /></MenuItem>
                    <MenuItem value='restricted'><Translations text='Restricted' /></MenuItem>
                    <MenuItem value='active'><Translations text='Active' /></MenuItem>
                    <MenuItem value='banned'><Translations text='Banned' /></MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
          <Dialog
            open={openDialog}
            onClose={handleDialogClose}
          >
            {selectedUserData && (
              <UserViewDetail userData={selectedUserData} handleClose={handleDialogClose} />
            )}
          </Dialog>
        </Card>
      </Grid>
      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const cardStatsData = {
    statsHorizontal: [
      {
        stats: '1,458',
        trend: 'positive',
        trendNumber: '8.1%',
        title: 'New Customers',
        icon: 'mdi:account-outline'
      },

      {
        icon: 'mdi:poll',
        stats: '$28.5k',
        color: 'warning',
        trendNumber: '18.2%',
        title: 'Total Profit'
      },

      {
        color: 'info',
        stats: '2,450k',
        trend: 'negative',
        icon: 'mdi:trending-up',
        trendNumber: '24.6%',
        title: 'New Transactions'
      },
      {
        stats: '$48.2K',
        color: 'success',
        icon: 'mdi:currency-usd',
        trendNumber: '22.5%',
        title: 'Total Revenue'
      }
    ],
    statsVertical: [
      {
        stats: '155k',
        color: 'primary',
        icon: 'mdi:cart-plus',
        trendNumber: '+22%',
        title: 'Total Orders',
        chipText: 'Last 4 Month'
      },
      {
        stats: '$89.34k',
        color: 'warning',
        trend: 'negative',
        trendNumber: '-18%',
        title: 'Total Profit',
        icon: 'mdi:wallet-giftcard',
        chipText: 'Last One Year'
      },
      {
        icon: 'mdi:link',
        color: 'info',
        stats: '142.8k',
        trendNumber: '+62%',
        chipText: 'Last One Year',
        title: 'Total Impression'
      },
      {
        stats: '$13.4k',
        color: 'success',
        trendNumber: '+38%',
        icon: 'mdi:currency-usd',
        title: 'Total Sales',
        chipText: 'Last Six Months'
      },
      {
        color: 'error',
        stats: '$8.16k',
        trend: 'negative',
        trendNumber: '-16%',
        title: 'Total Expenses',
        icon: 'mdi:briefcase-outline',
        chipText: 'Last One Month'
      },
      {
        stats: '$2.55k',
        color: 'secondary',
        icon: 'mdi:trending-up',
        trendNumber: '+46%',
        title: 'Transactions',
        chipText: 'Last One Year'
      }
    ],
    statsCharacter: [
      {
        stats: '8.14k',
        title: 'Ratings',
        chipColor: 'primary',
        trendNumber: '+15.6%',
        chipText: 'Year of 2022',
        src: '/images/cards/card-stats-img-1.png'
      },
      {
        stats: '12.2k',
        trend: 'negative',
        title: 'Sessions',
        chipColor: 'success',
        trendNumber: '-25.5%',
        chipText: 'Last Month',
        src: '/images/cards/card-stats-img-2.png'
      },
      {
        stats: '42.4k',
        title: 'Customers',
        chipColor: 'warning',
        trendNumber: '+9.2%',
        chipText: 'Daily Customers',
        src: '/images/cards/card-stats-img-3.png'
      },
      {
        stats: '4.25k',
        trendNumber: '+10.8%',
        chipColor: 'secondary',
        title: 'Total Orders',
        chipText: 'Last Week',
        src: '/images/cards/card-stats-img-4.png'
      }
    ]
  }

  // toDo task: implement API for the top panel bars data.
  // const res = await axios.get('/cards/statistics')

  const apiData = cardStatsData;

  return {
    props: {
      apiData
    }
  }
}

export default UserList
