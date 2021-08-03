import { AccountInfo, PublicKey } from '@solana/web3.js'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { account, utils, PoolData } from '@senswap/sen-js'

import util from 'helpers/util'
import { appName } from '../package.json'

/**
 * Store constructor
 */

export type State = Record<string, PoolData>

const NAME = util.normalizeAppName(appName)
const initialState: State = {}

/**
 * Actions
 */

export const getPools = createAsyncThunk(`${NAME}/getPools`, async () => {
  const { swap, splt } = window.senos
  // Get all pools
  const value: Array<{ pubkey: PublicKey; account: AccountInfo<Buffer> }> =
    await swap.connection.getProgramAccounts(swap.swapProgramId, {
      filters: [{ dataSize: 313 }],
    })
  const allPools = value.map(({ pubkey, account: { data: buf } }) => {
    const address = pubkey.toBase58()
    const data = swap.parsePoolData(buf)
    return { address, ...data }
  })
  // Get lpt mint for each pool
  const mintLPTAddresses = allPools.map(({ mint_lpt }) => mint_lpt)
  const mintLPTPublicKeys = mintLPTAddresses.map(
    (mintLPTAddress) => account.fromAddress(mintLPTAddress) as PublicKey,
  )
  const mintData = (
    await utils.wrappedGetMultipleAccountsInfo(
      swap.connection,
      mintLPTPublicKeys,
    )
  ).map(({ data }) => {
    try {
      return splt.parseMintData(data)
    } catch (er) {
      return undefined
    }
  })
  // Derive pool address from mint lpt data
  const poolAddresses = await Promise.all(
    mintData.map(async (mint) => {
      if (!mint) return undefined
      try {
        const { mint_authority, freeze_authority } = mint
        return await swap.derivePoolAddress(mint_authority, freeze_authority)
      } catch (er) {
        return undefined
      }
    }),
  )
  // Verify the pool address
  let bulk: State = {}
  allPools.forEach(({ address, ...data }, i) => {
    if (account.isAddress(poolAddresses[i])) bulk[address] = data
  })
  return bulk
})

export const getPool = createAsyncThunk<
  State,
  { address: string },
  { state: any }
>(`${NAME}/getPool`, async ({ address }, { getState }) => {
  if (!account.isAddress(address)) throw new Error('Invalid pool address')
  const {
    pools: { [address]: data },
  } = getState()
  if (data) return { [address]: data }
  const { swap } = window.senos
  const raw = await swap.getPoolData(address)
  return { [address]: raw }
})

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
