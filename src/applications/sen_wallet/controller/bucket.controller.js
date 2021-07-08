import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ssjs from 'senswapjs';

import util from 'helpers/util';
import { appName } from '../package.json';

/**
 * Store constructor
 */
const NAME = util.normalizeAppName(appName);
const initialState = {}

/**
 * Actions
 */

export const upsetData = createAsyncThunk(`${NAME}/upsetData`, async ({ address, data }) => {
  if (!ssjs.isAddress(address)) throw new Error('Invalid address');
  if (!data) throw new Error('Data is empty');
  return { [address]: data }
});

export const upsetBatch = createAsyncThunk(`${NAME}/upsetBatch`, async (batch) => {
  let bulk = {}
  for (const { address, data } of batch) {
    if (!ssjs.isAddress(address)) throw new Error('Invalid address');
    if (!data) throw new Error('Data is empty');
    bulk[address] = data;
  }
  return bulk;
});

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: builder => void builder
    .addCase(upsetData.fulfilled, (state, { payload }) => void Object.assign(state, payload))
    .addCase(upsetBatch.fulfilled, (state, { payload }) => void Object.assign(state, payload))
});

export default slice.reducer;