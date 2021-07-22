import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import ssjs from 'senswapjs'

import util from 'helpers/util'
import { appName } from '../package.json'

/**
 * Store constructor
 */

const NAME = util.normalizeAppName(appName)
const initialState = {}

/**
 * Actions
 */

export const getMint = createAsyncThunk(
  `${NAME}/getMint`,
  async ({ address }, { getState }) => {
    if (!ssjs.isAddress(address)) throw new Error('Invalid address')
    const {
      mints: { [address]: data },
    } = getState()
    if (data) return { [address]: data }
    const { splt } = window.senos
    const raw = await splt.getMintData(address)
    return { [address]: raw }
  },
)

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: (builder) =>
    void builder.addCase(
      getMint.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
