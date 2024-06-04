// src\store\apps\transaction\index.ts
import { RootState } from 'src/store'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  EwalletTransactionType,
  CryptoTransactionType,
  v2PoolTransactionType,
  UpgradeHistoryType,
  ActiveBonusTransactionType,
  PassiveBonusTransactionType,
  RegisteredUserTransactionType
} from 'src/types/apps/transactionTypes';
import axiosInstance from 'src/configs/axiosConfig';

interface DataParams {
  type: string;
  id?: string;
  username?: string;
  startDate?: string;
  endDate?: string;
  forceRefresh?: boolean;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

interface TransactionState {
  ewallet: EwalletTransactionType[];
  crypto: CryptoTransactionType[];
  v2Pool: v2PoolTransactionType[];
  upgradeHistory: UpgradeHistoryType[];
  activeBonus: ActiveBonusTransactionType[];
  passiveBonus: PassiveBonusTransactionType[];
  registeredUsers: RegisteredUserTransactionType[]; // Add this state
}

const initialState: TransactionState = {
  ewallet: [],
  crypto: [],
  v2Pool: [],
  upgradeHistory: [],
  activeBonus: [],
  passiveBonus: [],
  registeredUsers: [] // Initialize this state
};


function getTransactionArrayByType(type: string, state: TransactionState):
  EwalletTransactionType[] | CryptoTransactionType[] | v2PoolTransactionType[] |
  UpgradeHistoryType[] | ActiveBonusTransactionType[] | PassiveBonusTransactionType[] |
  RegisteredUserTransactionType[] | undefined {
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
    case 'registeredUsers':
      return state.registeredUsers;
    default:
      return undefined;
  }
}

export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async (params: DataParams, { getState, rejectWithValue }) => {
    const { type, page = 0, pageSize = 100 } = params;
    const state = getState() as RootState;

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
          case 'registeredUsers':
            state.registeredUsers = data || [];
            break;
          default:
            break;
        }
      });
  }

});

export default appTransactionsSlice.reducer;
