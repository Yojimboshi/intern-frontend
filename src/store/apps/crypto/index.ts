// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// ** Types
interface PriceChange {
  id: string
  priceChangeToday: number
  priceChangeBefore: number
  high_24h: number
  low_24h: number
}

interface DailyChange {
  date: string
  change: number
}

interface CryptoState {
  marketCapChange: number | null
  dailyChanges: DailyChange[] | null
  priceChange: PriceChange[] | null
  loading: boolean
  error: string | null
}

interface MarketDominance {
  categories: string[]
  series: { name: string; data: number[] }[]
}

// ** Initial State
const initialState: CryptoState & { marketDominance: MarketDominance | null } = {
  marketCapChange: null,
  dailyChanges: null,
  priceChange: null,
  loading: false,
  error: null,
  marketDominance: null
}

// ** Fetch Market Dominance Data
export const fetchMarketDominance = createAsyncThunk('crypto/fetchMarketDominance', async () => {
  const specifiedCategories = [
    'Liquid Staking',
    'Dog-Themed',
    'Smart Contract Platform',
    'Centralized Exchange (CEX)',
    'Decentralized Exchange (DEX)',
    'Meme',
    'Automated Market Maker (AMM)',
    'Gaming (GameFi)'
  ]

  const response = await axios.get('https://api.coingecko.com/api/v3/coins/categories')
  const data = response.data

  const filteredCategories = data.filter((item: any) =>
    specifiedCategories.includes(item.name)
  )

  const categories = filteredCategories.map((item: any) => item.name)
  const series = [{
    name: 'Market Cap',
    data: filteredCategories.map((item: any) => item.market_cap)
  }]

  return { categories, series }
})

// ** Fetch Market Cap Change
export const fetchMarketCapChange = createAsyncThunk('crypto/fetchMarketCapChange', async () => {
  const response = await axios.get('https://api.coingecko.com/api/v3/global')

  return response.data.data.market_cap_change_percentage_24h_usd
})

// ** Fetch Daily Changes
export const fetchDailyChanges = createAsyncThunk('crypto/fetchDailyChanges', async () => {
  const today = new Date()
  const changes: DailyChange[] = []

  for (let i = 0; i <= 6; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const response = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol: 'BTCUSDT',
        interval: '1d',
        startTime: new Date(formattedDate).getTime(),
        endTime: new Date(formattedDate).getTime() + 86400000
      }
    })

    const marketCapChange = response.data[0] ? (response.data[0][4] - response.data[0][1]) / response.data[0][1] * 100 : 0
    changes.push({ date: formattedDate, change: marketCapChange })
  }

  return changes
})

// ** Fetch Price Change
export const fetchPriceChange = createAsyncThunk('crypto/fetchPriceChange', async () => {
  const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
    params: {
      vs_currency: 'usd',
      ids: 'bitcoin,ethereum,binancecoin,solana,ripple',
      order: 'market_cap_desc',
      per_page: 100,
      page: 1,
      sparkline: false,
      price_change_percentage: '7d'
    }
  })

  return response.data.map((coin: any) => ({
    id: coin.id,
    priceChangeToday: parseFloat(coin.price_change_percentage_24h.toFixed(2)),
    priceChangeBefore: parseFloat(coin.price_change_percentage_7d_in_currency.toFixed(2)),
    high_24h: coin.high_24h,
    low_24h: coin.low_24h
  }))
})

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMarketCapChange.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMarketCapChange.fulfilled, (state, action) => {
        state.marketCapChange = action.payload
        state.loading = false
      })
      .addCase(fetchMarketCapChange.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch market cap change'
      })
      .addCase(fetchDailyChanges.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDailyChanges.fulfilled, (state, action) => {
        state.dailyChanges = action.payload
        state.loading = false
      })
      .addCase(fetchDailyChanges.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch daily changes'
      })
      .addCase(fetchPriceChange.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPriceChange.fulfilled, (state, action) => {
        state.priceChange = action.payload
        state.loading = false
      })
      .addCase(fetchPriceChange.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch price changes'
      })
    builder
      .addCase(fetchMarketDominance.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMarketDominance.fulfilled, (state, action) => {
        state.marketDominance = action.payload
        state.loading = false
      })
      .addCase(fetchMarketDominance.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch market dominance data'
      })
  }
})

export default cryptoSlice.reducer
