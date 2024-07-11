// src\views\dashboards\analytics\AnalyticsTotalTransactions.tsx
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { ApexOptions } from 'apexcharts'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

import { usePriceChange } from 'src/hooks/crypoPriceFetch';



// Styled Grid component
const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const AnalyticsTotalTransactions = () => {
  // ** Hook
  const theme = useTheme()

  const { priceChange, loading: dailyChangeLoading } = usePriceChange();

  if (dailyChangeLoading) {
    return <p>Loading...</p>;
  }

  // NOTE: remove USDT/tether from the series, as it is stable coin.
  // make the display more informative, % symbol, Y-axis labelling etc...
  // make negative changes red color, currently it shows same color.
  const series = [
    {
      name: 'Todays price change',
      data: priceChange ? [priceChange[0].priceChangeToday, priceChange[1].priceChangeToday,
      priceChange[2].priceChangeToday, priceChange[3].priceChangeToday, priceChange[4].priceChangeToday] : []
    },

    // {
    //   name: 'Last week price change',
    //   data: priceChange ? [priceChange[0].priceChangeBefore, priceChange[1].priceChangeBefore,
    //   priceChange[2].priceChangeBefore, priceChange[3].priceChangeBefore, priceChange[4].priceChangeBefore] : []
    // }

  ]
  const options: ApexOptions = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        barHeight: '30%',
        horizontal: true,
        endingShape: 'flat',
        startingShape: 'rounded'
      }
    },
    tooltip: {
      y: {
        formatter: val => `${Math.abs(val)}`
      }
    },
    xaxis: {
      position: 'top',
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: priceChange ? [priceChange[0].id, priceChange[1].id, priceChange[2].id, priceChange[3].id, priceChange[4].id] : [],
      labels: {
        formatter: val => `${Math.abs(Number(val))}`,
        style: { colors: theme.palette.text.disabled }
      }
    },
    yaxis: {
      labels: { show: false }
    },
    colors: [hexToRGBA(theme.palette.primary.main, 1), hexToRGBA(theme.palette.success.main, 1)],
    grid: {
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: 5,
        bottom: -25
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    }
  }

  return (
    <Card>
      <Grid container>
        <StyledGrid item xs={12} sm={7}>
          <CardHeader title='Price Change' titleTypographyProps={{ sx: { letterSpacing: '0.15px' } }} />
          <CardContent
            sx={{
              '& .apexcharts-series[rel="2"]': {
                transform: theme.direction === 'rtl' ? 'translateX(-5px)' : 'translateX(5px)'
              }
            }}
          >
            <ReactApexcharts type='bar' height={278} series={series} options={options} />
          </CardContent>
        </StyledGrid>
        <Grid item xs={12} sm={5}>
          <CardHeader
            title='Market Price'
            subheader='Bitcoin market price changes%'
            subheaderTypographyProps={{ sx: { lineHeight: 1.429 } }}
            titleTypographyProps={{ sx: { letterSpacing: '0.15px' } }}
            action={
              <OptionsMenu
                options={priceChange ? [priceChange[0].id, priceChange[1].id, priceChange[2].id, priceChange[3].id, priceChange[4].id] : []}
                iconButtonProps={{ size: 'small', className: 'card-more-options' }}
              />
            }
          />
          <CardContent sx={{ pt: theme => `${theme.spacing(6)} !important` }}>
            <Grid container>
              <Grid
                item
                xs={6}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  borderRight: theme => `1px solid ${theme.palette.divider}`
                }}
              >
                <CustomAvatar skin='light' sx={{ mb: 3 }} color='success' variant='rounded'>
                  <Icon icon='mdi:trending-up' />
                </CustomAvatar>
                <Typography sx={{ mb: 0.5 }} variant='body2'>
                  High
                </Typography>
                {priceChange && priceChange[0] ? (
                  <Typography sx={{ fontWeight: 600 }}>{priceChange[0].high_24h}</Typography>
                ) : (
                  <Typography sx={{ fontWeight: 600 }}>N/A</Typography>
                )}
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CustomAvatar skin='light' sx={{ mb: 3 }} variant='rounded'>
                  <Icon icon='mdi:trending-down' />
                </CustomAvatar>
                <Typography sx={{ mb: 0.5 }} variant='body2'>
                  Low
                </Typography>
                {priceChange && priceChange[0] ? (
                  <Typography sx={{ fontWeight: 600 }}>{priceChange[0].low_24h}</Typography>
                ) : (
                  <Typography sx={{ fontWeight: 600 }}>N/A</Typography>
                )}
              </Grid>
            </Grid>
            <Divider
              sx={{ mt: theme => `${theme.spacing(10)} !important`, mb: theme => `${theme.spacing(7.5)} !important` }}
            />
            <Grid container>
              <Grid
                item
                xs={6}
                sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}
              >
                <Typography sx={{ mb: 0.5 }} variant='body2'>
                  Todays price change %
                </Typography>
                {priceChange && priceChange[0] ? (
                  <Typography sx={{ fontWeight: 600 }}>{priceChange[0].priceChangeToday} %</Typography>
                ) : (
                  <Typography sx={{ fontWeight: 600 }}>N/A</Typography>
                )}
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant='contained'>
                  View Report
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default AnalyticsTotalTransactions
