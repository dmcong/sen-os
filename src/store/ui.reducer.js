import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const getInfix = () => {
  const width = window.innerWidth;
  if (width < 576) return 'xs';
  if (width < 768) return 'sm';
  if (width < 992) return 'md';
  if (width < 1200) return 'lg';
  if (width < 1400) return 'xl';
  return 'xxl';
}

const NAME = 'ui';
const initialState = {
  width: window.innerWidth,
  infix: getInfix(),
  spacing: 16,
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

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: builder => builder
    .addCase(resize.fulfilled, (state, { payload }) => ({ ...state, ...payload }))
});

export default slice.reducer;