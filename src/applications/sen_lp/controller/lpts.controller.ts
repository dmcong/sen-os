import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PublicKey } from '@solana/web3.js'
import { account, AccountData } from '@senswap/sen-js'

import util from 'helpers/util'
import { appName } from '../package.json'

/**
 * Store constructor
 */
export type LPTData = AccountData & { pool: string }
export type State = Record<string, LPTData>

const NAME = util.normalizeAppName(appName)
const initialState: State = {}

/**
 * Actions
 */

export const getLPTs = createAsyncThunk(
  `${NAME}/getLPTs`,
  async ({ owner }: { owner: string }) => {
    if (!account.isAddress(owner))
      throw new Error('Invalid owner/wallet address')
    const { splt, swap } = window.senos
    // Get all splt accounts
    const { value } = await splt.connection.getTokenAccountsByOwner(
      account.fromAddress(owner) as PublicKey,
      { programId: splt.spltProgramId },
    )
    const accounts = value.map(({ pubkey, account: { data: buf } }) => {
      const address = pubkey.toBase58()
      const data = splt.parseAccountData(buf)
      return { address, ...data }
    })
    // Get the corresponding mint list
    const mintAddresses = accounts.map(({ mint: mintAddress }) => mintAddress)
    let mintPublicKeys = mintAddresses.map(
      (mintAddress) => account.fromAddress(mintAddress) as PublicKey,
    )
    // Validate whether lp mint or normal mint
    const mintData = (
      await splt.connection.getMultipleAccountsInfo(mintPublicKeys)
    )?.map(({ data }) => splt.parseMintData(data))
    if (!mintData?.length) return {}
    const poolAddresses = await Promise.all(
      mintData.map(async ({ mint_authority, freeze_authority }) => {
        try {
          return await swap.derivePoolAddress(mint_authority, freeze_authority)
        } catch (er) {
          return undefined
        }
      }),
    )
    // Filter lpt accounts
    let bulk: State = {}
    accounts.forEach(({ address, ...data }, index) => {
      const poolAddress = poolAddresses[index]
      if (account.isAddress(poolAddress))
        bulk[address] = { ...data, pool: poolAddress as string }
    })
    return bulk
  },
)

export const getLPT = createAsyncThunk<
  State,
  { address: string },
  { state: any }
>(`${NAME}/getLPT`, async ({ address }, { getState }) => {
  if (!account.isAddress(address)) throw new Error('Invalid account address')
  const {
    accounts: { [address]: data },
  } = getState()
  if (data) return { [address]: data }
  const { swap } = window.senos
  const raw = await swap.getLPTData(address)
  return { [address]: raw }
})

export const upsetLPT = createAsyncThunk<
  State,
  { address: string; data: AccountData },
  { state: any }
>(`${NAME}/upsetLPT`, async ({ address, data }, { getState }) => {
  if (!account.isAddress(address)) throw new Error('Invalid address')
  if (!data) throw new Error('Data is empty')
  const {
    accounts: {
      [address]: { pool },
    },
  } = getState()
  if (account.isAddress(pool)) return { [address]: { ...data, pool } }
  // To make sure the new account is an lpt account
  const { swap } = window.senos
  const raw = await swap.getLPTData(address)
  return { [address]: raw }
})

export const deleteLPT = createAsyncThunk(
  `${NAME}/deleteAccount`,
  async ({ address }: { address: string }) => {
    if (!account.isAddress(address)) throw new Error('Invalid address')
    return { address }
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
    void builder
      .addCase(
        getLPTs.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        getLPT.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetLPT.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        deleteLPT.fulfilled,
        (state, { payload }) => void delete state[payload.address],
      ),
})

export default slice.reducer
