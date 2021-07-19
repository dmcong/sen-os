import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import ssjs from 'senswapjs'

import PDB from 'helpers/pdb'

/**
 * Interface & Utility
 */

type Apps = Array<Array<string>>

type State = {
  apps: Apps
}

const troubleshoot = (apps: Apps): Apps => {
  if (!apps || !Array.isArray(apps)) return [[]]
  if (!apps.length) return [[]]
  return apps.map((row) => row.filter((appName) => appName))
}

/**
 * Store constructor
 */

const NAME = 'babysitter'
const initialState: State = {
  apps: [[]],
}

/**
 * Actions
 */

export const loadApps = createAsyncThunk<State, any, { state: any }>(
  `${NAME}/loadApps`,
  async (_, { getState }) => {
    const {
      wallet: { address },
    } = getState()
    if (!ssjs.isAddress(address)) throw new Error('Wallet is not connected yet')
    const db = new PDB(address).createInstance('senos')
    const apps = troubleshoot((await db.getItem('apps')) || initialState.apps)
    return { apps }
  },
)

export const updateApps = createAsyncThunk<State, Apps, { state: any }>(
  `${NAME}/updateApps`,
  async (apps, { getState }) => {
    const {
      wallet: { address },
    } = getState()
    if (!ssjs.isAddress(address)) throw new Error('Wallet is not connected yet')
    const db = new PDB(address).createInstance('senos')
    apps = troubleshoot(apps)
    await db.setItem('apps', apps)
    return { apps }
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
      .addCase(loadApps.fulfilled, (state, { payload }) => void Object.assign(state, payload))
      .addCase(updateApps.fulfilled, (state, { payload }) => void Object.assign(state, payload)),
})

export default slice.reducer
