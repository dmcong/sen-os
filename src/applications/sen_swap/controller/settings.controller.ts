import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import util from 'helpers/util'
import { appName } from '../package.json'

export type State = {
  slippage: number
  advanced: boolean
}

const NAME = util.normalizeAppName(appName)
const initialState: State = {
  slippage: 0.01,
  advanced: false,
}

/**
 * Actions
 */

export const updateSettings = createAsyncThunk(
  `${NAME}/updateSettings`,
  async (settings: Partial<State>) => {
    return settings
  },
)

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder.addCase(
      updateSettings.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
