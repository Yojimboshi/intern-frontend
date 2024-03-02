// src/hooks/useEWallet.tsx
import { useState, useCallback } from 'react';
import axios from 'src/configs/axiosConfig';

const EWALLET_URL = '/ewallet';  // Adjust this URL according to your backend route structure

export const useEWallet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleError = (operation: string, error: any) => {
    const errorMessage = error?.response?.data?.message || error.message || "An unknown error occurred.";
    console.error(`Error ${operation}:`, errorMessage);
    setError(errorMessage);
  };

  const getAvailableCoins = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${EWALLET_URL}/availableCoins`);

      return response.data;  // Assuming the API returns the list of available coins
    } catch (error) {
      handleError("fetching available coins", error);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const requestDeposit = async (coinId: number, amount: number) => {
    try {
      setLoading(true);
      const payload = { coinId, amount };
      const response = await axios.post(`${EWALLET_URL}/request-deposit`, payload);

      return response.data;  // Assuming the API returns the result of the deposit request
    } catch (error) {
      handleError("requesting deposit", error);

      return null;
    } finally {
      setLoading(false);
    }
  }

  const transfer = async (payload: any) => {
    try {
      setLoading(true);
      const response = await axios.post(`${EWALLET_URL}/transfer`, payload);

      return response.data;  // Assuming the API returns the result of the transfer
    } catch (error) {
      handleError("transferring funds", error);

      return null;
    } finally {
      setLoading(false);
    }
  }

  const convert = async (payload: any) => {
    try {
      setLoading(true);
      const response = await axios.post(`${EWALLET_URL}/convert`, payload);

      return response.data;  // Assuming the API returns the result of the conversion
    } catch (error) {
      handleError("converting currency", error);

      return null;
    } finally {
      setLoading(false);
    }
  }

  const withdraw = async (payload: any) => {
    try {
      setLoading(true);
      const response = await axios.post(`${EWALLET_URL}/withdraw`, payload);

      return response.data;  // Assuming the API returns the result of the withdrawal
    } catch (error) {
      handleError("withdrawing funds", error);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const getUserBalances = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${EWALLET_URL}/wallet/balances`);

      return response.data;  // Assuming the API returns the user's balances
    } catch (error) {
      handleError("fetching user balances", error);

      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  const listPendingDeposits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${EWALLET_URL}/pending-deposits`);

      return response.data;  // Assuming the API returns the list of pending deposits
    } catch (error) {
      handleError("listing pending deposits", error);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const approveDeposit = async (requestId: string) => {
    try {
      setLoading(true);
      const response = await axios.post(`${EWALLET_URL}/approve-deposit/${requestId}`);

      return response.data;  // Assuming the API returns the result of the approval
    } catch (error) {
      handleError("approving deposit", error);

      return null;
    } finally {
      setLoading(false);
    }
  }

  const deposit = async (payload: any) => {
    try {
      setLoading(true);
      const response = await axios.post(`${EWALLET_URL}/deposit`, payload);

      return response.data;  // Assuming the API returns the result of the deposit
    } catch (error) {
      handleError("depositing funds", error);

      return null;
    } finally {
      setLoading(false);
    }
  }


  return {
    loading,
    error,
    getAvailableCoins,
    requestDeposit,
    transfer,
    convert,
    withdraw,
    getUserBalances,

    listPendingDeposits,
    approveDeposit,
    deposit,
  };
};

export default useEWallet;
