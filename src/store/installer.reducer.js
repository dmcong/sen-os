import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ssjs from 'senswapjs';
import { createPDB } from 'helpers/pdb';

const db = createPDB('senos');

const NAME = 'installer';
const initialState = {
  address: '',
  apps: [],
}

/**
 * Actions
 */

export const loadApps = createAsyncThunk(`${NAME}/loadApps`, async (address, { rejectWithValue }) => {
  if (!ssjs.isAddress(address)) return rejectWithValue('Invalid wallet address');
  try {
    const collection = db.createInstance({ storeName: address });
    const apps = await collection.getItem('apps') || [];
    return { address, apps }
  } catch (er) {
    return rejectWithValue(er);
  }
});

export const updateApps = createAsyncThunk(`${NAME}/updateApps`, async (apps, { getState, rejectWithValue }) => {
  const { installer: { address } } = getState();
  if (!ssjs.isAddress(address)) return rejectWithValue('You need to load apps first');
  try {
    const collection = db.createInstance({ storeName: address });
    await collection.setItem('apps', apps);
    return { apps }
  } catch (er) {
    return rejectWithValue(er);
  }
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