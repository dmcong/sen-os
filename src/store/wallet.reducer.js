import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const NAME = 'wallet';

/**
 * Actions
 */

export const getUser = createAsyncThunk(
  `${NAME}/getUser`,
  async (address) => {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await wait(1000);
    return { address, role: 'user' }
  }
)

/**
 * Usual procedure
 */

const initialState = {
  user: {},
  address: '',
  lamports: 0,
}

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: builder => builder
    .addCase(getUser.fulfilled, (state, { payload }) => {
      state = { ...state, ...payload }
      return state;
    })
});

export default slice.reducer;