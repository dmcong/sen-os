import { AccountInfo, PublicKey } from '@solana/web3.js'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import {
  account,
  DEFAULT_SWAP_PROGRAM_ADDRESS,
  PoolData,
} from '@senswap/sen-js'

import util from 'helpers/util'
import api from 'helpers/api'
import configs from '@/sen_swap/configs'
import { appName } from '../package.json'

export type State = Record<string, PoolData>

const NAME = util.normalizeAppName(appName)
const initialState: State = {}

/**
 * Actions
 */

export const getPools = createAsyncThunk(`${NAME}/getPools`, async () => {
  const { swap } = window.senos
  const programId = account.fromAddress(
    DEFAULT_SWAP_PROGRAM_ADDRESS,
  ) as PublicKey
  const value: Array<{ pubkey: PublicKey; account: AccountInfo<Buffer> }> =
    await swap.connection.getProgramAccounts(programId, {
      filters: [{ dataSize: 313 }],
    })
  let bulk: Record<string, any> = {}
  value.forEach(({ pubkey, account: { data: buf } }) => {
    const address = pubkey.toBase58()
    const data = swap.parsePoolData(buf)
    return (bulk[address] = data)
  })
  return bulk
})

export const getPool = createAsyncThunk<State, string, { state: any }>(
  `${NAME}/getPool`,
  async (address, { getState }) => {
    const { pool } = getState()
    if (pool[address]) return { [address]: pool[address] }
    const {
      api: { base },
    } = configs
    const { data } = await api.get(base + '/pool', { address })
    return { [address]: data }
  },
)

export const upsetPool = createAsyncThunk<
  State,
  { address: string; data: PoolData },
  { state: any }
>(`${NAME}/upsetPool`, async ({ address, data }) => {
  if (!account.isAddress(address)) throw new Error('Invalid pool address')
  if (!data) throw new Error('Data is empty')
  return { [address]: data }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(
        getPools.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        getPool.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetPool.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
