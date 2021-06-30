import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import pokemon from 'pokemon';

import util from 'helpers/util';
import metadata from '../../package.json';

const NAME = util.normalizeAppName(metadata.name);
const initialState = {
  name: pokemon.random(),
}

/**
 * Actions
 */

export const choosePokemon = createAsyncThunk(`${NAME}/choosePokemon`, async () => {
  return { name: pokemon.random() }
});

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: builder => void builder
    .addCase(choosePokemon.fulfilled, (state, { payload }) => void Object.assign(state, payload))
});

export default slice.reducer;