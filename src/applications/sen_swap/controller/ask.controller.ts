import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AccountData } from '@senswap/sen-js'
import { TokenInfo } from '@solana/spl-token-registry'

import util from 'helpers/util'
import { appName } from '../package.json'
import { ExtendedPoolData } from '../view/selection/mintSelection'

export type State = {
  amount: string // Desired amount
  accountData?: AccountData // Associated account to the selected token
  mintInfo?: TokenInfo // Selected token
  poolData?: ExtendedPoolData // Selected pool (for advanced mode)
  pools: ExtendedPoolData[] // List of available pools
  priority: number
}

const NAME = util.normalizeAppName(appName)
const initialState: State = {
  amount: '',
  pools: [],
  priority: 0,
}

/**
 * Actions
 */
export const updateAskData = createAsyncThunk<
  Partial<State>,
  Partial<State> & { prioritized?: boolean; reset?: boolean },
  { state: any }
>(
  `${NAME}/updateAskData`,
  async ({ prioritized, reset, ...askData }, { getState }) => {
    const {
      bid: { priority: refPriority },
      ask: { priority: prevPriority },
    } = getState()
    const priority = reset ? 0 : prioritized ? refPriority + 1 : prevPriority
    return { ...askData, priority }
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
      updateAskData.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
