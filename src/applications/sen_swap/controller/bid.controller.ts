import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AccountData } from '@senswap/sen-js'
import { TokenInfo } from '@solana/spl-token-registry'

import util from 'helpers/util'
import { appName } from '../package.json'
import { ExpandedPoolData } from '../view/selection/mintSelection'

export type State = {
  amount: string // Desired amount
  accountData?: AccountData // Associated account to the selected token
  mintInfo?: TokenInfo // Selected token
  poolData?: ExpandedPoolData // Selected pool (for advanced mode)
  pools: ExpandedPoolData[] // List of available pools
}

const NAME = util.normalizeAppName(appName)
const initialState: State = {
  amount: '',
  pools: [],
}

/**
 * Actions
 */

export const updateBidData = createAsyncThunk(
  `${NAME}/updateBidData`,
  async (bidData: Partial<State>) => {
    return { bidData }
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
      updateBidData.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
