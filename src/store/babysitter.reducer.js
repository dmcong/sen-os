import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import ssjs from 'senswapjs';
import { createPDB } from 'helpers/pdb';


/**
 * Utility
 */

const troubleshoot = (apps) => {
  if (!apps || !Array.isArray(apps)) return [[]];
  if (!apps.length) return [[]];
  return apps.map(row => row.filter(appName => appName));
}

/**
 * Store constructor
 */

const NAME = 'babysitter';
const initialState = {
  apps: [[]],
}

/**
 * Actions
 */

export const loadApps = createAsyncThunk(`${NAME}/loadApps`, async (_, { getState }) => {
  const { wallet: { address } } = getState();
  if (!ssjs.isAddress(address)) throw new Error('Wallet is not connected yet');
  const db = createPDB(address).createInstance({ storeName: 'senos' });
  const apps = troubleshoot(await db.getItem('apps'));
  return { apps }
});

export const updateApps = createAsyncThunk(`${NAME}/updateApps`, async (apps, { getState }) => {
  const { wallet: { address } } = getState();
  if (!ssjs.isAddress(address)) throw new Error('Wallet is not connected yet');
  const db = createPDB(address).createInstance({ storeName: 'senos' });
  apps = troubleshoot(apps);
  await db.setItem('apps', apps);
  return { apps }
});

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: builder => void builder
    .addCase(loadApps.fulfilled, (state, { payload }) => void Object.assign(state, payload))
    .addCase(updateApps.fulfilled, (state, { payload }) => void Object.assign(state, payload))
});

export default slice.reducer;