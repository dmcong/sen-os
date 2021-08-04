import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import util from 'helpers/util'
import { appName } from '../package.json'

const NAME = util.normalizeAppName(appName)
const initialState = {
  deployID: '',
}

/**
 * Actions
 */

export const connectDatabase = createAsyncThunk(
  `${NAME}/connect`,
  async (data) => {
    const deployID = data
    return { deployID: deployID }
  },
)

export const disconnectDatabase = createAsyncThunk(
  `${NAME}/disconnect`,
  async () => {
    return { deployID: '' }
  },
)

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: (builder) =>
    void builder
      .addCase(
        connectDatabase.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        disconnectDatabase.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
