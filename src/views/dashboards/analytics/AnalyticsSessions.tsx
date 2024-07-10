// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// ** Third Party Imports
import { ApexOptions } from 'apexcharts';

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts';

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';

import { useMarketCapChange, useDailyChanges } from 'src/hooks/crypoPriceFetch';

const AnalyticsSessions = () => {
  // ** Hook
  const theme = useTheme();

  // NOTE: custom functions
  const { marketCapChange, loading: loadingMarketCap } = useMarketCapChange();
  const { dailyChanges, loading: dailyChangeLoading } = useDailyChanges();

  if (loadingMarketCap || dailyChangeLoading) {
    return <p>Loading...</p>;
  }

  // Ensure dailyChanges is defined and not null
  const changesData = dailyChanges || [];
  console.log('Market Cap Change:', marketCapChange); // Log market cap change
  console.log('Daily Changes:', changesData); // Log daily changes

  const series = [{ data: changesData }];

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { enabled: false },
    grid: {
      strokeDashArray: 6,
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -15,
        left: -7,
        right: 7,
        bottom: -15
      }
    },
    stroke: { width: 3 },
    colors: [hexToRGBA(theme.palette.info.main, 1)],
    markers: {
      size: 6,
      offsetY: 2,
      offsetX: -1,
      strokeWidth: 3,
      colors: ['transparent'],
      strokeColors: 'transparent',
      discrete: changesData.length ? [
        {
          size: 6,
          seriesIndex: 0,
          strokeColor: theme.palette.info.main,
          fillColor: theme.palette.background.paper,
          dataPointIndex: changesData.length - 1
        }
      ] : [],
      hover: { size: 7 }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: { show: false }
    }
  };
  // NOTE: change the label texts.
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant='h6' sx={{ mr: 1.5 }}>
            $$$
          </Typography>
          <Typography variant='subtitle2' sx={{ color: 'success.main' }}>
            {marketCapChange !== null ? `${marketCapChange.toFixed(2)}%` : 'N/A'}
          </Typography>
        </Box>
        <Typography variant='body2'>Sessions</Typography>
        <ReactApexcharts type='line' height={108} options={options} series={series} />
      </CardContent>
    </Card>
  );
};

export default AnalyticsSessions;
