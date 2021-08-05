import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account, RawWallet } from '@senswap/sen-js'

import util from 'helpers/util'
import { appName } from '../package.json'

export type State = {
  address: string
  secretKey: string
  txId: string
}

const NAME = util.normalizeAppName(appName)
const initialState: State = {
  address: '5vHjWRc2hys4XwZkMktg35N8oALt5d1ZXYkwCXXX3JHm',
  secretKey:
    'e06a1a17cf400f6c322e32377a9a7653eecf58f3eb0061023b743c689b43a5fa491573553e4afdcdcd1c94692a138dd2fd0dc0f6946ef798ba34ac1ad00b3720',
  txId: '',
}

/**
 * Actions
 */

export const airdrop = createAsyncThunk<
  { txId: string },
  { srcAddress: string; dstAddress: string },
  { state: any }
>(`${NAME}/airdrop`, async ({ srcAddress, dstAddress }, { getState }) => {
  const {
    main: { secretKey },
  } = getState()
  if (!account.isAddress(srcAddress)) throw new Error('Invalid source address')
  if (!account.isAddress(dstAddress))
    throw new Error('Invalid destination address')
  const wallet = new RawWallet(secretKey)
  const { splt } = window.senos
  const { txId } = await splt.transfer(
    BigInt(10000000000), // 10 tokens
    srcAddress,
    dstAddress,
    wallet,
  )
  return { txId }
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
      airdrop.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
