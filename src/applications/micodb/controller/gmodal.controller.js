import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import util from 'helpers/util'
import { appName } from '../package.json'

const NAME = util.normalizeAppName(appName)
const initialState = {
  isOpen: false,
  dom: null,
}

/**
 * Actions
 */

export const openGModal = createAsyncThunk(`${NAME}/open`, async (data) => {
  const { dom } = data
  return { isOpen: true, dom }
})

export const closeGModal = createAsyncThunk(`${NAME}/close`, async () => {
  return { isOpen: false, dom: null }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: (builder) =>
    void builder
      .addCase(
        openGModal.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        closeGModal.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
