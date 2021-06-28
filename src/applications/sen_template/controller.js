import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import util from 'helpers/util';
import metadata from './metadata';

const NAME = util.normalizeAppName(metadata.appName);
const initialState = {
  time: Number(new Date()),
}

/**
 * Actions
 */

export const updateTime = createAsyncThunk(`${NAME}/updateTime`, async () => {
  return { time: Number(new Date()) }
});

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: builder => builder
    .addCase(updateTime.fulfilled, (state, { payload }) => ({ ...state, ...payload }))
});

export default slice.reducer;