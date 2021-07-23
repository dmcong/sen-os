import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import ssjs from 'senswapjs'

import configs from 'configs'
import IPFS from 'helpers/ipfs'

/**
 * Interface & Utility
 */

export type State = {
  visible: boolean
  address: string
  lamports: bigint
}

const initializeWindowSenOs = async (wallet: any) => {
  const {
    sol: { spltAddress, splataAddress, node },
  } = configs
  window.senos = {
    wallet: wallet,
    lamports: new ssjs.Lamports(node),
    splt: new ssjs.SPLT(spltAddress, splataAddress, node),
    ipfs: new IPFS(),
  }
}

const destroyWindowSenOs = async () => {
  if (window.senos?.wallet) window.senos.wallet.disconnect()
  await initializeWindowSenOs(null)
}

/**
 * Store constructor
 */

const NAME = 'wallet'
const initialState: State = {
  visible: false,
  address: '',
  lamports: global.BigInt(0),
}

/**
 * Actions
 */

export const openWallet = createAsyncThunk(`${NAME}/openWallet`, async () => {
  return { visible: true }
})

export const closeWallet = createAsyncThunk(`${NAME}/closeWallet`, async () => {
  return { visible: false }
})

export const connectWallet = createAsyncThunk(
  `${NAME}/connectWallet`,
  async (wallet: any) => {
    if (!wallet) throw new Error('Invalid wallet instance')
    await initializeWindowSenOs(wallet)
    const address = await wallet.getAccount()
    const lamports = await window.senos.lamports.get(address)
    return { address, lamports: global.BigInt(lamports), visible: false }
  },
)

export const updateWallet = createAsyncThunk(
  `${NAME}/updateWallet`,
  async ({ lamports }: Partial<State>) => {
    return { lamports }
  },
)

export const disconnectWallet = createAsyncThunk(
  `${NAME}/disconnectWallet`,
  async () => {
    await destroyWindowSenOs()
    window.location.reload() // Reset all redux store
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
        openWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        closeWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        connectWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        updateWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        disconnectWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
