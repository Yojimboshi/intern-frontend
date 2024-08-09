import React, { useState } from 'react'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { ApexOptions } from 'apexcharts'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import useMarketDominance from '../../../hooks/samCryptoPerformance'
import FormHelperText from '@mui/material/FormHelperText'

const AnalyticsPerformance = () => {
  const theme = useTheme()
  const { series, categories, loading } = useMarketDominance()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  React.useEffect(() => {
    setSelectedCategories(categories.slice(0, 5));
  }, [categories])

  const handleCategoryChange = (event: any) => {
    const {
      target: { value }
    } = event
    if (value.length <= 5) {
      setSelectedCategories(value)
      setError('')
    } else {
      setError('You can only select up to 5 categories.')
    }
  }

  // Map of full names to short names
  const nameMapping: { [key: string]: string } = {
    'Liquid Staking': 'LS',
    'Dog-Themed': 'Dog',
    'Smart Contract Platform': 'SCP',
    'Centralized Exchange (CEX)': 'CEX',
    'Decentralized Exchange (DEX)': 'DEX',
    'Meme': 'Meme',
    'Automated Market Maker (AMM)': 'AMM',
    'Gaming (GameFi)': 'GameFi'
  }

  // Filter the series data to include only the selected categories
  const filteredSeries = series.map(series => ({
    ...series,
    data: series.data.filter((_, index) => selectedCategories.includes(categories[index]))
  }))

  // Map the selected categories to their short names
  const shortLabels = selectedCategories.map(category => nameMapping[category] || category)

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    legend: {
      markers: { offsetX: -2 },
      itemMargin: { horizontal: 10 },
      labels: { colors: theme.palette.text.secondary }
    },
    plotOptions: {
      radar: {
        size: 100,
        polygons: {
          strokeColors: theme.palette.divider,
          connectorColors: theme.palette.divider
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: [theme.palette.warning.main, theme.palette.primary.main],
        shadeIntensity: 1,
        type: 'vertical',
        opacityFrom: 1,
        opacityTo: 0.9,
        stops: [0, 100]
      }
    },
    colors: [theme.palette.warning.main, theme.palette.primary.main],
    labels: shortLabels,
    markers: { size: 0 },
    xaxis: {
      labels: {
        show: true,
        style: {
          fontSize: '14px',
          colors: selectedCategories.map(() => theme.palette.text.disabled)
        }
      }
    },
    yaxis: { show: false },
    grid: { show: false },
    tooltip: {
      y: {
        formatter: (value: number, { dataPointIndex }: { dataPointIndex: number }) => {
          const fullName = selectedCategories[dataPointIndex]

          return `${fullName}: ${value}`
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Market Dominance'
        action={
          <>
            <Select
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              renderValue={(selected) => `${selected.length} categories selected`}
              style={{ minWidth: 200 }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText error>{error}</FormHelperText>}
          </>
        }
      />
      <CardContent
        sx={{
          pt: { xs: `${theme.spacing(6)} !important`, md: `${theme.spacing(0)} !important` },
          pb: { xs: `${theme.spacing(8)} !important`, md: `${theme.spacing(5)} !important` }
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <ReactApexcharts type='radar' height={278} series={filteredSeries} options={options} />
          </div>
        )}
      </CardContent>
    </Card >
  )
}

export default AnalyticsPerformance
