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

export const getCGK = createAsyncThunk(`${NAME}/getCGK`, async (ticket, { getState }) => {
  if (!ticket) throw new Error('Invalid ticket');
  const { cgk: { [ticket]: data } } = getState();
  const { timestamp } = data || { timestamp: 0 }
  if (Number(new Date()) - timestamp < 60000) return { [ticket]: data }
  const raw = await ssjs.parseCGK(ticket);
  return { [ticket]: { ...raw, timestamp: Number(new Date()) } }
});

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: builder => void builder
    .addCase(getCGK.fulfilled, (state, { payload }) => void Object.assign(state, payload))
});

export default slice.reducer;