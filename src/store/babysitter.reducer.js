import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ssjs from 'senswapjs';
import { createPDB } from 'helpers/pdb';

const db = createPDB('senos');
const troubleshoot = (apps) => {
  if (!apps || !Array.isArray(apps)) return [[]];
  if (!apps.length) return [[]];
  return apps.map(row => row.filter(appName => appName));
}

const NAME = 'babysitter';
const initialState = {
  address: '',
  apps: [[]],
}

/**
 * Actions
 */

export const loadApps = createAsyncThunk(`${NAME}/loadApps`, async (address) => {
  if (!ssjs.isAddress(address)) return initialState;
  const collection = db.createInstance({ storeName: address });
  const apps = troubleshoot(await collection.getItem('apps'));
  return { address, apps }
});

export const updateApps = createAsyncThunk(`${NAME}/updateApps`, async (apps, { getState }) => {
  const { babysitter: { address } } = getState();
  if (!ssjs.isAddress(address)) throw new Error('You need to load apps first');
  const collection = db.createInstance({ storeName: address });
  await collection.setItem('apps', apps);
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