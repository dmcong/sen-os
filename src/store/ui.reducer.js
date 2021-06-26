import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const NAME = 'ui';

/**
 * Utility
 */

const getInfix = () => {
  const width = window.innerWidth;
  if (width < 576) return 'xs';
  if (width < 768) return 'sm';
  if (width < 992) return 'md';
  if (width < 1200) return 'lg';
  if (width < 1400) return 'xl';
  return 'xxl';
}

/**
 * Actions
 */

export const resize = createAsyncThunk(`${NAME}/resize`, async () => {
  const width = window.innerWidth;
  const infix = getInfix();
  return { width, infix }
});

/**
 * Usual procedure
 */

const initialState = {
  width: window.innerWidth,
  infix: getInfix(),
  spacing: 32,
}

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: builder => builder
    .addCase(resize.fulfilled, (state, { payload }) => ({ ...state, ...payload }))
});

export default slice.reducer;