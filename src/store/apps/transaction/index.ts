// src\store\apps\transaction\index.ts
import { RootState } from 'src/store'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  EwalletTransactionType,
  CryptoTransactionType,
  v2PoolTransactionType,
  UpgradeHistoryType,
  ActiveBonusTransactionType,
  PassiveBonusTransactionType
} from 'src/types/apps/transactionTypes';
import axiosInstance from 'src/configs/axiosConfig';

interface DataParams {
  type: string;
  id?: string;
  username?: string;
  startDate?: string;
  endDate?: string;
  forceRefresh?: boolean;
}

interface TransactionState {
  ewallet: EwalletTransactionType[];
  crypto: CryptoTransactionType[];
  v2Pool: v2PoolTransactionType[];
  upgradeHistory: UpgradeHistoryType[];
  activeBonus: ActiveBonusTransactionType[];
  passiveBonus: PassiveBonusTransactionType[];
}

const initialState: TransactionState = {
  ewallet: [],
  crypto: [],
  v2Pool: [],
  upgradeHistory: [],
  activeBonus: [],
  passiveBonus: [],
};

function getTransactionArrayByType(type: string, state: TransactionState):
  EwalletTransactionType[] | CryptoTransactionType[] | v2PoolTransactionType[] |
  UpgradeHistoryType[] | ActiveBonusTransactionType[] | PassiveBonusTransactionType[] | undefined {
  switch (type) {
    case 'ewallet':
      return state.ewallet;
    case 'crypto':
      return state.crypto;
    case 'v2Pool':
      return state.v2Pool;
    case 'upgradeHistory':
      return state.upgradeHistory;
    case 'activeBonus':
      return state.activeBonus;
    case 'passiveBonus':
      return state.passiveBonus;
    default:
      return undefined;
  }
}

export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async (params: DataParams, { getState, rejectWithValue }) => {
    const { type, forceRefresh } = params;
    const state = getState() as RootState;

    if (!forceRefresh) {
      const transactions = getTransactionArrayByType(type, state.transaction);
      if (transactions && transactions.length > 0) {
        console.log(`Transactions of type ${type} fetched from store`);

        return { type, data: transactions };
      }
    }

    console.log('Requesting transactions with params:', params);
    try {
      const response = await axiosInstance.get('/admin/transactions', { params });
      console.log('Transactions fetched:', response.data);

      return { type: params.type, data: response.data };
    } catch (error: any) {
      console.error('Error in fetchTransactions:', error);

      return rejectWithValue(error.response.data);
    }
  }
);

export const appTransactionsSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        const { type, data } = action.payload;
        console.log(`Processing transaction data of type: ${type}`, data);
        switch (type) {
          case 'ewallet':
            state.ewallet = data || [];
            break;
          case 'crypto':
            state.crypto = data || [];
            break;
          case 'v2Pool':
            state.v2Pool = data || [];
            break;
          case 'upgradeHistory':
            state.upgradeHistory = data || [];
            break;
          case 'activeBonus':
            state.activeBonus = data || [];
            break;
          case 'passiveBonus':
            state.passiveBonus = data || [];
            break;
          default:
            break;
        }
      });
  }

});

export default appTransactionsSlice.reducer;
