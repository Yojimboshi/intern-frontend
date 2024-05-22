// src/store/apps/downlines.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'src/configs/axiosConfig';

interface DownlineState {
  data: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DownlineState = {
  data: [],
  status: 'idle',
  error: null,
};


export const fetchDownlines = createAsyncThunk(
  'downlines/fetchDownlines',
  async ({ dates, q, status }: { dates: Date[]; q: string; status: string }, { getState }) => {
    const response = await axios.get(`/users/downlines`, {
      params: {
        startDate: dates[0] ? dates[0].toISOString().split('T')[0] : undefined,
        endDate: dates[1] ? dates[1].toISOString().split('T')[0] : undefined,
        q,
        status,
      },
    });
    return response.data;
  }
);

const downlinesSlice = createSlice({
  name: 'downlines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDownlines.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDownlines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDownlines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default downlinesSlice.reducer;
