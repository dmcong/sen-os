import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import pokemon from 'pokemon';
import metadata from './metadata';

const NAME = metadata.appName.replace(' ', '_').toLowerCase();
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
  extraReducers: builder => builder
    .addCase(choosePokemon.fulfilled, (state, { payload }) => ({ ...state, ...payload }))
});

export default slice.reducer;