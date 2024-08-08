import { useState, useEffect } from 'react'
import axios from 'axios'

interface MarketDominance {
  name: string
  data: number[]
}

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

const useMarketDominance = () => {
  const [series, setSeries] = useState<{ name: string, data: number[] }[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchMarketDominance = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/categories')
        const data = response.data

        // Filter data based on the specified categories
        const filteredCategories = data.filter((item: any) =>
          specifiedCategories.includes(item.name)
        )

        // Extract category names and their market caps
        const categoryNames = filteredCategories.map((item: any) => item.name)
        const marketCaps = filteredCategories.map((item: any) => item.market_cap)

        // Create series data
        const newSeries = [{
          name: 'Market Cap',
          data: marketCaps
        }]

        setCategories(categoryNames)
        setSeries(newSeries)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching market dominance data:', error)
        setLoading(false)
      }
    }

    fetchMarketDominance()
  }, [])

  return { series, categories, loading }
}

export default useMarketDominance
