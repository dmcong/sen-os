import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import util from 'helpers/util'
import { appName } from '../package.json'

const NAME = util.normalizeAppName(appName)
const initialState = {
  time: Number(new Date()),
}

/**
 * Actions
 */

export const updateTime = createAsyncThunk(`${NAME}/updateTime`, async () => {
  return { time: Number(new Date()) }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: (builder) =>
    void builder.addCase(
      updateTime.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
