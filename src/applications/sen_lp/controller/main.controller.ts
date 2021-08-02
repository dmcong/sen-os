import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import util from 'helpers/util'
import { appName } from '../package.json'

export type State = {
  time: number
}

const NAME = util.normalizeAppName(appName)
const initialState: State = {
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
  reducers: {},
  extraReducers: (builder) =>
    void builder.addCase(
      updateTime.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
