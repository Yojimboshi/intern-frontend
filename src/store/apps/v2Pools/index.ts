// src\store\apps\v2Pools\index.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PoolDetails, PoolsState } from 'src/types/apps/v2PoolsTypes';
import axios from 'src/configs/axiosConfig';

// Async thunk to fetch pools data
export const fetchPools = createAsyncThunk<PoolDetails[], void>(
  'pools/fetchPools',
  async () => {
    const response = await axios.get('/pools/search');
    console.log("Response from API:", response.data.pools); // Logging API response

    return response.data.pools;
  }
);


// Define the initial state using the PoolsState interface
const initialState: PoolsState = {
  data: [],
};

// Pools slice
export const poolsSlice = createSlice({
  name: 'pools',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPools.fulfilled, (state, action: PayloadAction<PoolDetails[]>) => {
      console.log("Updating pools state with:", action.payload); // Logging new data
      state.data = action.payload;
    });
  },
});

export default poolsSlice.reducer;
