// src\hooks\useCrypto.tsx
import { useState } from 'react';
import axios from 'src/configs/axiosConfig';
import SUPPORTED_TOKENS from 'src/configs/tokenConfig';
import { Network } from 'src/types/apps/networkTypes';

const USER_URL = '/crypto';
type TokenSymbol = typeof SUPPORTED_TOKENS[number];
type NetworkType = Network['code'];

export const useCrypto = () => {
  const [loading, setLoading] = useState(false);

  const handleError = (operation: string, error: any) => {
    const errorMessage = error?.response?.data?.message || error.message || "An unknown error occurred.";
    console.error(`Error ${operation}:`, errorMessage);
  };

  const generateNewAddress = async () => {
    try {
      setLoading(true)
      const response = await axios.post(`${USER_URL}/generate-deposit-address`, {});

      return {
        erc20Address: response.data.erc20Address,
        trc20Address: response.data.trc20Address,
        solanaAddress: response.data.solanaAddress
      };
    } catch (error) {
      handleError("generating new address", error);

      return {};
    } finally {
      setLoading(false);  // Stop loading animation and reset loading state
    }
  };

  const fetchDepositData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${USER_URL}/deposit`);
      console.log("Received deposit data:", response.data);
      const { hasAddresses, erc20Address, trc20Address, solanaAddress } = response.data;

      return {
        hasAddresses,
        erc20Address,
        trc20Address,
        solanaAddress
      };
    } catch (error) {
      handleError("fetching deposit data", error);

      return {
        hasAddresses: false,
        erc20Address: null,
        trc20Address: null,
        solanaAddress: null,
      };
    } finally {
      setLoading(false);  // Stop loading animation and reset loading state
    }
  };


  const withdraw = async (
    amount: string,  // changed to string to match your frontend component
    address: string,
    tokenSymbol: TokenSymbol, // new parameter for token symbol
    network: NetworkType
  ) => {
    try {
      setLoading(true);
      const response = await axios.post(`${USER_URL}/withdraw`, {
        amount,
        address,
        tokenSymbol, // include token symbol in the request
        network
      });

      return {
        success: true,
        message: response.data.message,
        txHash: response.data.txHash ? response.data.txHash : null
      };
    } catch (error: any) {
      handleError("processing withdrawal", error);

      return {
        success: false,
        message: error.response && error.response.data ? error.response.data.message : "An error occurred"
      };
    } finally {
      setLoading(false);
    }
  };

  const transfer = async (
    amount: string,
    recipient: string,
    tokenSymbol: TokenSymbol
  ) => {
    try {
      setLoading(true);
      const response = await axios.post(`${USER_URL}/transfer`, {
        amount,
        recipient,
        tokenSymbol
      });

      return {
        success: true,
        message: response.data.message,
        txHash: response.data.txHash ? response.data.txHash : null
      };
    } catch (error: any) {
      handleError("processing transfer", error);
      return {
        success: false,
        message: error.response && error.response.data ? error.response.data.message : "An error occurred"
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateNewAddress,
    fetchDepositData,
    withdraw,
    transfer,
  };
};
