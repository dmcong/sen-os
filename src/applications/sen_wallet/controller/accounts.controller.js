import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account } from '@senswap/sen-js'

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

export const getAccounts = createAsyncThunk(
  `${NAME}/getAccounts`,
  async (ownerAddress) => {
    if (!account.isAddress(ownerAddress))
      throw new Error('Invalid owner/wallet address')
    const { splt } = window.senos
    const ownerPublicKey = account.fromAddress(ownerAddress)
    const { value } = await splt.connection.getTokenAccountsByOwner(
      ownerPublicKey,
      { programId: splt.spltProgramId },
    )
    let bulk = {}
    value.forEach(({ pubkey, account: { data: buf } }) => {
      const address = pubkey.toBase58()
      const data = splt.parseAccountData(buf)
      return (bulk[address] = data)
    })
    return bulk
  },
)

export const getAccount = createAsyncThunk(
  `${NAME}/getAccount`,
  async ({ address }, { getState }) => {
    if (!account.isAddress(address)) throw new Error('Invalid account address')
    const {
      accounts: { [address]: data },
    } = getState()
    if (data) return { [address]: data }
    const { splt } = window.senos
    const raw = await splt.getAccountData(address)
    return { [address]: raw }
  },
)

export const upsetAccount = createAsyncThunk(
  `${NAME}/upsetAccount`,
  async ({ address, data }) => {
    if (!account.isAddress(address)) throw new Error('Invalid address')
    if (!data) throw new Error('Data is empty')
    return { [address]: data }
  },
)

export const deleteAccount = createAsyncThunk(
  `${NAME}/deleteAccount`,
  async ({ address }, { getState }) => {
    if (!account.isAddress(address)) throw new Error('Invalid address')
    const {
      accounts: { [address]: data },
    } = getState()
    if (!data) return {}
    return { address }
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
        getAccounts.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        getAccount.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetAccount.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        deleteAccount.fulfilled,
        (state, { payload }) => void delete state[payload.address],
      ),
})

export default slice.reducer
