// src\hooks\useV2Pool.ts
import { useState, useCallback } from 'react';
import axios from 'src/configs/axiosConfig';

const V2POOL_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/pools';

export function useV2Pool() {
  const [pool, setPool] = useState<any>({}); // This is for storing the details of a specific pool
  const [error, setError] = useState<string>('');
  const [loading, setLoadingState] = useState(false);

  const handleError = (operation: string, error: any) => {
    const errorMessage = error?.response?.data?.message || error.message || "An unknown error occurred.";
    console.error(`Error ${operation}:`, errorMessage);
    setError(errorMessage);
  };

  // Admin specific actions
  const createNewPool = async (tokenA: string, tokenB: string, initialTokenAReserve: number, initialTokenBReserve: number) => {
    if (!tokenA || !tokenB || !initialTokenAReserve || !initialTokenBReserve) {
      throw new Error("Invalid parameters for creating pool");
    }

    try {
      setLoadingState(true);
      const response = await axios.post(`${V2POOL_API_URL}/create`, { tokenA, tokenB, initialTokenAReserve, initialTokenBReserve });

      return response.data;
    } catch (error) {
      handleError("creating new pool", error);
    } finally {
      setLoadingState(false);
    }
  };

  // For reading K
  const readPoolK = async (tokenA: string, tokenB: string) => {
    if (!tokenA || !tokenB) {
      throw new Error("Both tokenA and tokenB are required");
    }

    try {
      setLoadingState(true);
      const response = await axios.get(`${V2POOL_API_URL}/k/${tokenA}/${tokenB}/read`);

      return response.data;
    } catch (error) {
      handleError("fetching K value", error);
    } finally {
      setLoadingState(false);
    }
  };

  const adjustPoolK = async (tokenA: string, tokenB: string, newTokenAReserve: number, newTokenBReserve: number) => {
    if (!tokenA || !tokenB || !newTokenAReserve || !newTokenBReserve) {
      throw new Error("Invalid parameters for adjusting K value");
    }

    try {
      setLoadingState(true);
      const response = await axios.put(`${V2POOL_API_URL}/k/${tokenA}/${tokenB}/modify`, {
        newTokenAReserve,
        newTokenBReserve
      });

      return response.data;
    } catch (error) {
      handleError("adjusting K value", error);
    } finally {
      setLoadingState(false);
    }
  };

  const searchPool = useCallback(async (tokenA?: string, tokenB?: string) => {
    try {
      setLoadingState(true);

      // Build the query string based on the tokens provided
      let queryString = '';
      if (tokenA && tokenB) {
        queryString = `?tokenA=${tokenA}&tokenB=${tokenB}`;
      }

      // Fetch pools using the constructed query string
      const response = await axios.get(`${V2POOL_API_URL}/search${queryString}`);
      setPool(response.data);  // Setting the fetched pool details to state
      return response.data;
    } catch (error) {
      handleError("searching for pool", error);
    } finally {
      setLoadingState(false);
    }
  }, []);

  const performSwap = async (
    tokenA: string,
    tokenB: string,
    amount: number,
    inputBox = 'left',
    onSwapCompleted?: () => Promise<void>
  ) => {
    if (!tokenA || !tokenB || !amount || !inputBox) {
      throw new Error("Invalid parameters for performing a swap");
    }

    try {
      setLoadingState(true);
      const response = await axios.post(`${V2POOL_API_URL}/${tokenA}/${tokenB}/swap`, {
        amount,
        inputBox
      });
      if (onSwapCompleted) {
        await onSwapCompleted();
      }

      return response.data;
    } catch (error) {
      handleError("performing a swap", error);
    } finally {
      setLoadingState(false);
    }
  };

  const addLiquidityToPool = async (tokenA: string, tokenB: string, amountADesired: number, amountBDesired: number) => {
    if (!tokenA || !tokenB || !amountADesired || !amountBDesired) {
      throw new Error("Invalid parameters for adding liquidity");
    }

    try {
      setLoadingState(true);
      const response = await axios.post(`${V2POOL_API_URL}/${tokenA}/${tokenB}/add-liquidity`, {
        amountADesired,
        amountBDesired
      });

      return response.data;
    } catch (error) {
      handleError("adding liquidity", error);
    } finally {
      setLoadingState(false);
    }
  };

  const removeLiquidityFromPool = async (tokenA: string, tokenB: string, liquidityTokens: number, amountAMin: number, amountBMin: number) => {
    if (!tokenA || !tokenB || !liquidityTokens || !amountAMin || !amountBMin) {
      throw new Error("Invalid parameters for removing liquidity");
    }

    try {
      setLoadingState(true);
      const response = await axios.post(`${V2POOL_API_URL}/${tokenA}/${tokenB}/remove-liquidity`, {
        liquidityTokens,
        amountAMin,
        amountBMin
      });

      return response.data;
    } catch (error) {
      handleError("removing liquidity", error);
    } finally {
      setLoadingState(false);
    }
  };


  const calculateAmountOut = async (tokenA: string, tokenB: string, amountIn: number) => {
    try {
      setLoadingState(true);
      const response = await axios.post(`${V2POOL_API_URL}/${tokenA}/${tokenB}/amount-out`, { amountIn });

      return response.data;
    } catch (error) {
      handleError("calculating amount out", error);
    } finally {
      setLoadingState(false);
    }
  };

  const calculateAmountIn = async (tokenA: string, tokenB: string, amountOut: number) => {
    try {
      setLoadingState(true);
      const response = await axios.post(`${V2POOL_API_URL}/${tokenA}/${tokenB}/amount-in`, { amountOut });

      return response.data;
    } catch (error) {
      handleError("calculating amount in", error);
    } finally {
      setLoadingState(false);
    }
  };


  const calculateAddLiquidityOutput = async (tokenA: string, tokenB: string, reserveA: number, reserveB: number, amountA: number) => {
    try {
      setLoadingState(true);

      // Construct the query string
      const queryParams = new URLSearchParams({
        reserveA: reserveA.toString(),
        reserveB: reserveB.toString(),
        amountA: amountA.toString()
      });

      // Append the query string to the URL
      const response = await axios.get(`${V2POOL_API_URL}/${tokenA}/${tokenB}/calculate-add-liquidity-output?${queryParams.toString()}`);

      return response.data;
    } catch (error) {
      handleError("calculating add liquidity output", error);
    } finally {
      setLoadingState(false);
    }
  };

  const calculateRemoveLiquidityOutput = async (tokenA: string, tokenB: string, reserveA: number, reserveB: number, totalLPTokenSupply: number, liquidityTokens: number) => {
    try {
      setLoadingState(true);

      // Construct the query string
      const queryParams = new URLSearchParams({
        reserveA: reserveA.toString(),
        reserveB: reserveB.toString(),
        totalLPTokenSupply: totalLPTokenSupply.toString(),
        liquidityTokens: liquidityTokens.toString()
      });

      // Append the query string to the URL
      const response = await axios.get(`${V2POOL_API_URL}/${tokenA}/${tokenB}/calculate-remove-liquidity-output?${queryParams.toString()}`);

      return response.data;
    } catch (error) {
      handleError("calculating remove liquidity output", error);
    } finally {
      setLoadingState(false);
    }
  };

  const getSlippage = async (poolId: string) => {
    try {
      setLoadingState(true);
      const response = await axios.get(`${V2POOL_API_URL}/${poolId}/get-slippage`,);

      return response.data;
    } catch (error) {
      handleError("getting slippage", error);
    } finally {
      setLoadingState(false);
    }
  };

  const quote = async (poolId: string) => {
    try {
      setLoadingState(true);
      const response = await axios.get(`${V2POOL_API_URL}/${poolId}/quote`,);

      return response.data;
    } catch (error) {
      handleError("quoting", error);
    } finally {
      setLoadingState(false);
    }
  };

  // task TO DO
  const getLPTokenBalance = async (tokenA: string, tokenB: string) => {
    try {
      setLoadingState(true);
      const response = await axios.get(`${V2POOL_API_URL}/${tokenA}/${tokenB}/get-lp-token-balance`,);

      return response.data;
    } catch (error) {
      handleError("getting LP token balance", error);
    } finally {
      setLoadingState(false);
    }
  };

  // task TO DO
  const getTotalLPTokenSupply = async (tokenA: string, tokenB: string) => {
    try {
      setLoadingState(true);
      const response = await axios.get(`${V2POOL_API_URL}/${tokenA}/${tokenB}/get-total-lp-token-supply`);

      return response.data;
    } catch (error) {
      handleError("getting total LP token supply", error);
    } finally {
      setLoadingState(false);
    }
  };


  const checkUserCryptoBalance = useCallback(async (username?: string) => {
    try {
      setLoadingState(true);

      // endpoint empty = fetch all users (only admin)
      // endpoint = username fetch only 1 user
      // (for normal user) = only fetch own balance
      let endpoint = `${V2POOL_API_URL}/check-user-crypto-balance`;
      if (username) {
        endpoint += `?username=${username}`;
      }

      const response = await axios.get(endpoint,);
      console.log(response.data)

      return response.data;
    } catch (error) {
      handleError("checking user crypto balance", error);
    } finally {
      setLoadingState(false);
    }
  }, []);

  return {
    // State
    pool,
    error,
    loading,

    // Functions
    createNewPool,  // Admin
    adjustPoolK,    // Admin
    readPoolK,      // Admin
    // Common
    searchPool,
    performSwap,
    addLiquidityToPool,
    removeLiquidityFromPool,

    //quote
    calculateAmountOut,
    calculateAmountIn,
    calculateAddLiquidityOutput,
    calculateRemoveLiquidityOutput,
    getSlippage,
    quote,
    getLPTokenBalance,
    getTotalLPTokenSupply,
    checkUserCryptoBalance
  };
}
