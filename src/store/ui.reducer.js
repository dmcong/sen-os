import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { notification, Icon } from 'sen-kit';
import util from 'helpers/util';

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
  touchable: util.isTouchable(),
  visibleControlCenter: false,
}

/**
 * Actions
 */

export const resize = createAsyncThunk(`${NAME}/resize`, async () => {
  const width = window.innerWidth;
  const infix = getInfix();
  return { width, infix }
});

export const openControlCenter = createAsyncThunk(`${NAME}/openControlCenter`, async () => {
  document.body.style.overflow = 'hidden';
  return { visibleControlCenter: true }
});

export const closeControlCenter = createAsyncThunk(`${NAME}/closeControlCenter`, async () => {
  document.body.style.overflow = 'scroll';
  return { visibleControlCenter: false }
});

export const notify = createAsyncThunk(`${NAME}/notify`, async (
  { type, description, onClick }, { rejectWithValue }
) => {
  if (!type) return rejectWithValue('Notification type is not provided');
  if (!description) return rejectWithValue('Description is not provided');
  // Parse icon
  let icon = <Icon name="information-circle-outline" style={{ color: '#37CDFA' }} />
  if (type === 'error') icon = <Icon name="close-circle-outline" style={{ color: '#F2323F' }} />
  if (type === 'warning') icon = <Icon name="alert-circle-outline" style={{ color: '#FCB017' }} />
  if (type === 'success') icon = <Icon name="checkmark-circle-outline" style={{ color: '#3DBA4E' }} />
  notification[type]({
    message: type.toUpperCase(),
    description,
    onClick,
    closeIcon: <Icon name="close-outline" />,
    icon,
  });
  return {}
});

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: builder => void builder
    .addCase(resize.fulfilled, (state, { payload }) => void Object.assign(state, payload))
    .addCase(openControlCenter.fulfilled, (state, { payload }) => void Object.assign(state, payload))
    .addCase(closeControlCenter.fulfilled, (state, { payload }) => void Object.assign(state, payload))
    .addCase(notify.fulfilled, (state, { payload }) => void Object.assign(state, payload))
});

export default slice.reducer;