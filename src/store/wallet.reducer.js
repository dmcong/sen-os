import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const NAME = 'wallet';
const initialState = {
  visible: false,
  address: '',
  lamports: 0,
}

/**
 * Actions
 */

export const openWallet = createAsyncThunk(`${NAME}/openWallet`, async () => {
  return { visible: true }
});

export const closeWallet = createAsyncThunk(`${NAME}/closeWallet`, async () => {
  return { visible: false }
});

export const connectWallet = createAsyncThunk(`${NAME}/connectWallet`, async (wallet) => {
  if (!wallet) throw new Error('Invalid wallet instance');
  window.senos.wallet = wallet;
  const address = await wallet.getAccount();
  const lamports = await window.senos.lamports.get(address);
  return { address, lamports: global.BigInt(lamports), visible: false }
});

export const disconnectWallet = createAsyncThunk(`${NAME}/disconnectWallet`, async () => {
  if (!window.senos || !window.senos.wallet) return { ...initialState }
  window.senos.wallet.disconnect();
  window.senos.wallet = null;
  return { ...initialState }
});

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: builder => void builder
    .addCase(openWallet.fulfilled, (state, { payload }) => void Object.assign(state, payload))
    .addCase(closeWallet.fulfilled, (state, { payload }) => void Object.assign(state, payload))
    .addCase(connectWallet.fulfilled, (state, { payload }) => void Object.assign(state, payload))
    .addCase(disconnectWallet.fulfilled, (state, { payload }) => void Object.assign(state, payload))
});

export default slice.reducer;