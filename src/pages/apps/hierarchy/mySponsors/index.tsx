// src/pages/apps/hierarchy/MySponsors.tsx
import { useState, useEffect, forwardRef } from 'react'
import Link from 'next/link'
import {
  Box, Card, CardContent, CardHeader, FormControl, Grid,
  IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, deleteInvoice } from 'src/store/apps/invoice'
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { getInitials } from 'src/@core/utils/get-initials'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/apps/hierarchy/mySponsors/TableHeader'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { fetchDownlines } from 'src/store/apps/downlines';

interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: InvoiceType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'mdi:send' },
  Paid: { color: 'success', icon: 'mdi:check' },
  Draft: { color: 'primary', icon: 'mdi:content-save-outline' },
  'Partial Payment': { color: 'warning', icon: 'mdi:chart-pie' },
  'Past Due': { color: 'error', icon: 'mdi:information-outline' },
  Downloaded: { color: 'info', icon: 'mdi:arrow-down' }
}

// ** renders client column
const renderClient = (row: InvoiceType) => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
        sx={{ mr: 3, fontSize: '1rem', width: 34, height: 34 }}
      >
        {getInitials(row.name || 'John Doe')}
      </CustomAvatar>
    )
  }
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: '#',
    renderCell: ({ row }: CellType) => <LinkStyled href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</LinkStyled>
  },
  {
    flex: 0.1,
    minWidth: 80,
    field: 'invoiceStatus',
    renderHeader: () => (
      <Box sx={{ display: 'flex', color: 'action.active' }}>
        <Icon icon='mdi:trending-up' fontSize={20} />
      </Box>
    ),
    renderCell: ({ row }: CellType) => {
      const { dueDate, balance, invoiceStatus } = row

      const color = invoiceStatusObj[invoiceStatus] ? invoiceStatusObj[invoiceStatus].color : 'primary'

      return (
        <Tooltip
          title={
            <div>
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                {invoiceStatus}
              </Typography>
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Balance:
              </Typography>{' '}
              {balance}
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Due Date:
              </Typography>{' '}
              {dueDate}
            </div>
          }
        >
          <CustomAvatar skin='light' color={color} sx={{ width: 34, height: 34 }}>
            <Icon icon={invoiceStatusObj[invoiceStatus].icon} fontSize='1.25rem' />
          </CustomAvatar>
        </Tooltip>
      )
    }
  },
  {
    flex: 0.25,
    field: 'name',
    minWidth: 300,
    headerName: 'Username',
    renderCell: ({ row }: CellType) => {
      const { name, companyEmail } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant='body2'
              sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
            >
              {name}
            </Typography>
            <Typography noWrap variant='caption'>
              {companyEmail}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'Package',
    headerName: 'Package',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`$${row.total || 0}`}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 125,
    field: 'Joined Date',
    headerName: 'Joined Date',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.issuedDate}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'balance',
    headerName: 'Balance',
    renderCell: ({ row }: CellType) => {
      return row.balance !== 0 ? (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.balance}
        </Typography>
      ) : (
        <CustomChip size='small' skin='light' color='success' label='Paid' />
      )
    }
  }
]

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})
/* eslint-enable */

const MySponsors = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([]);
  const [value, setValue] = useState<string>('');
  const [statusValue, setStatusValue] = useState<string>('');
  const [endDateRange, setEndDateRange] = useState<Date | null>(null);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [startDateRange, setStartDateRange] = useState<Date | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();
  const downlineData = useSelector((state: RootState) => state.downlines.data);
  const downlineStatus = useSelector((state: RootState) => state.downlines.status);
  const downlineError = useSelector((state: RootState) => state.downlines.error);


  useEffect(() => {
    dispatch(
      fetchDownlines({
        dates,
        q: value,
        status: statusValue,
      })
    );
  }, [dispatch, dates, value, statusValue]);

  const handleFilter = (val: string) => {
    setValue(val);
  };

  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value);
  };

  const handleOnChangeRange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    if (start !== null && end !== null) {
      setDates(dates as Date[]);
    }
    setStartDateRange(start);
    setEndDateRange(end);
  };

  const columns: GridColDef[] = [
    // Add your default columns here
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
    },
    {
      field: 'packageId',
      headerName: 'Package ID',
      width: 150,
    },
    {
      field: 'joinedDate',
      headerName: 'Joined Date',
      width: 180,
    },
  ];

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Filters' />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='user-status-select'>User Status</InputLabel>

                    <Select
                      fullWidth
                      value={statusValue}
                      sx={{ mr: 4, mb: 2 }}
                      label='User Status'
                      onChange={handleStatusValue}
                      labelId='user-status-select'
                    >
                      <MenuItem value=''>Active</MenuItem>
                      <MenuItem value='downloaded'>Restricted</MenuItem>
                      <MenuItem value='draft'>Banned</MenuItem>

                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Joined Date'
                        end={endDateRange as number | Date}
                        start={startDateRange as number | Date}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
            <DataGrid
              autoHeight
              pagination
              rows={downlineData}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={rows => setSelectedRows(rows)}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default MySponsors
