import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const NAME = 'wallet';

/**
 * Actions
 */

export const openWallet = createAsyncThunk(`${NAME}/openWallet`, async () => {
  return { visible: true }
});

export const closeWallet = createAsyncThunk(`${NAME}/closeWallet`, async () => {
  return { visible: false }
});

export const connectWallet = createAsyncThunk(`${NAME}/connectWallet`, async (wallet, { rejectWithValue }) => {
  if (!wallet) return rejectWithValue('Invalid wallet instance');
  const address = await wallet.getAccount();
  const lamports = await window.senos.lamports.get(address);
  return { address, lamports, visible: false }
});

/**
 * Usual procedure
 */

const initialState = {
  visible: false,
  address: '',
  lamports: 0,
}

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: builder => builder
    .addCase(openWallet.fulfilled, (state, { payload }) => ({ ...state, ...payload }))
    .addCase(closeWallet.fulfilled, (state, { payload }) => ({ ...state, ...payload }))
    .addCase(connectWallet.fulfilled, (state, { payload }) => ({ ...state, ...payload }))
});

export default slice.reducer;