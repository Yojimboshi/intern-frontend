import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Grid, { GridProps } from '@mui/material/Grid';
import { styled, useTheme } from '@mui/material/styles';
import Icon from 'src/@core/components/icon';
import CustomAvatar from 'src/@core/components/mui/avatar';
import OptionsMenu from 'src/@core/components/option-menu';
import ReactApexcharts from 'src/@core/components/react-apexcharts';
import { ApexOptions } from 'apexcharts';

import { usePriceChange } from 'src/hooks/crypoPriceFetch';

type OptionType = string;

const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}));

const AnalyticsTotalTransactions = () => {
  const theme = useTheme();

  const { priceChange, loading: dailyChangeLoading } = usePriceChange();
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');

  useEffect(() => {
    if (priceChange && priceChange.length > 0) {
      const defaultCrypto = priceChange.find(item => item.id.toLowerCase() === 'bitcoin')?.id || priceChange[0].id;
      setSelectedCrypto(defaultCrypto);
    }
  }, [priceChange]);

  if (dailyChangeLoading) {
    return <p>Loading...</p>;
  }

  if (!priceChange || priceChange.length === 0) {
    return <p>No data available</p>;
  }

  const handleOptionSelect = (option: OptionType) => {
    setSelectedCrypto(option);
  };

  const selectedCryptoData = priceChange.find(item => item.id === selectedCrypto);

  const series = [
    {
      name: 'Todays price change',
      data: priceChange.map(item => item.priceChangeToday)
    }
  ];

  const colors = priceChange.map(item => item.priceChangeToday >= 0 ? theme.palette.success.main : theme.palette.error.main);

  const options: ApexOptions = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        barHeight: '20%',
        horizontal: true,
        endingShape: 'flat',
        startingShape: 'rounded',
        colors: {
          ranges: [
            {
              from: -100,
              to: 0,
              color: theme.palette.error.main
            },
            {
              from: 0,
              to: 100,
              color: theme.palette.success.main
            }
          ]
        }
      }
    },
    tooltip: {
      y: {
        formatter: val => `${Math.abs(val)}%`
      }
    },
    xaxis: {
      position: 'top',
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: priceChange.map(item => item.id),
      labels: {
        formatter: val => `${Math.abs(Number(val))}%`,
        style: { colors: theme.palette.text.disabled }
      }
    },
    yaxis: {
      labels: {
        show: true,
        formatter: (val, index) => priceChange[index] ? priceChange[index].id : '',
        style: { colors: theme.palette.text.primary }
      }
    },
    colors: colors,
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
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const id = priceChange[opts.dataPointIndex].id;

        return id.charAt(0).toUpperCase() + id.slice(1);
      },
      style: {
        colors: [theme.palette.text.primary],
        fontSize: '14px'
      }
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    }
  };

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Card>
      <Grid container>
        <StyledGrid item xs={12} sm={7}>
          <CardHeader
            title='Daily Price Change'
            subheader='Top 5 Cryptocurrencies daily price % change'
            titleTypographyProps={{ sx: { letterSpacing: '0.15px' } }}
          />
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
            title={selectedCryptoData ? `${capitalizeFirstLetter(selectedCryptoData.id)} Market Price` : ''}
            subheader={selectedCryptoData ? `${capitalizeFirstLetter(selectedCryptoData.id)} market price changes%` : ''}
            subheaderTypographyProps={{ sx: { lineHeight: 1.429 } }}
            titleTypographyProps={{ sx: { letterSpacing: '0.15px' } }}
            action={
              <OptionsMenu
                options={priceChange.map(item => item.id)}
                iconButtonProps={{ size: 'small', className: 'card-more-options' }}
                onOptionSelect={handleOptionSelect}
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
                {selectedCryptoData ? (
                  <Typography sx={{ fontWeight: 600 }}>${selectedCryptoData.high_24h}</Typography>
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
                {selectedCryptoData ? (
                  <Typography sx={{ fontWeight: 600 }}>${selectedCryptoData.low_24h}</Typography>
                ) : (
                  <Typography sx={{ fontWeight: 600 }}>N/A</Typography>
                )}
              </Grid>
            </Grid>
            <Divider sx={{ mt: theme => `${theme.spacing(10)} !important`, mb: theme => `${theme.spacing(7.5)} !important` }} />
            <Grid container>
              <Grid
                item
                xs={6}
                sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}
              >
                <Typography sx={{ mb: 0.5 }} variant='body2'>
                  Todays price change %
                </Typography>
                {selectedCryptoData ? (
                  <Typography sx={{ fontWeight: 600 }}>{selectedCryptoData.priceChangeToday}%</Typography>
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
  );
};

export default AnalyticsTotalTransactions;
