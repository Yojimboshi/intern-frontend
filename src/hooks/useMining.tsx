// src\hooks\useMining.tsx
import { useState, useCallback } from 'react';
import axios from 'src/configs/axiosConfig';
import { MiningTransaction } from 'src/types/apps/miningTypes';

const USER_URL = '/mining';

export const useMining = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleError = (operation: string, error: any) => {
    const errorMessage = error?.response?.data?.message || error.message || "An unknown error occurred.";
    console.error(`Error in ${operation}:`, errorMessage);
  };


  const toggleMining = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${USER_URL}/toggle`);
      // Assuming the backend response includes a success message or similar
      return response.data;
    } catch (error) {
      handleError("toggle mining", error);
      return null;
    } finally {
      setLoading(false);
    }
  };


  const speedUpMining = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${USER_URL}/speedup`);
      // Check if the speed-up operation was successful
      if (response.data.success) {
        // Operation was successful, handle accordingly
        // For example, you might want to show a success message to the user
        console.log(response.data.message); // Assuming there's a success message
        return response.data;
      } else {
        // Handle cases where `success` is false, if applicable
        // This could involve showing an error message to the user
        console.error("Speed up mining was not successful:", response.data.message);
        return null;
      }
    } catch (error) {
      handleError("speed up mining", error);
      return null;
    } finally {
      setLoading(false);
    }
  };


  const getUserMiningStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${USER_URL}/stats`);
      return response.data.stats; // Adjust this line
    } catch (error) {
      handleError("fetching user mining stats", error);
      return null;
    } finally {
      setLoading(false);
    }
  };


  const getMiningTransactions = async (transactionId?: string): Promise<MiningTransaction[]> => {
    setLoading(true);
    try {
      const url = transactionId ? `${USER_URL}/transactions/${transactionId}` : `${USER_URL}/transactions`;
      const response = await axios.get(url);
      // Ensure the response is always an array
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      handleError("fetching mining transactions", error);
      return []; // Return an empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  const getAllUserMiningStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${USER_URL}/admin/stats`);
      // Ensure the response is always an array, even when the backend returns a single object or null
      const data = response.data;
      return Array.isArray(data) ? data : data ? [data] : [];
    } catch (error) {
      handleError("fetching all user mining stats", error);
      return []; // Return an empty array in case of error
    } finally {
      setLoading(false);
    }
  };


  const getAllMiningTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${USER_URL}/admin/transactions`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching all mining transactions:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMiningActivity = async (userId: string, activityData: object) => {
    setLoading(true);
    try {
      const response = await axios.put(`${USER_URL}/admin/activity/${userId}`, activityData);
      // Assuming the backend response includes a success message or similar
      return response.data;
    } catch (error) {
      handleError("updating mining activity", error);
      return null;
    } finally {
      setLoading(false);
    }
  };


  return {
    loading,
    toggleMining,
    speedUpMining,
    getUserMiningStats,
    getMiningTransactions,
    getAllUserMiningStats,
    getAllMiningTransactions,
    updateMiningActivity,
  };
};
