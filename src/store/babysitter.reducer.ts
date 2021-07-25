import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account } from '@senswap/sen-js'

import PDB from 'helpers/pdb'

/**
 * Interface & Utility
 */

type Apps = Array<Array<string>>

type State = {
  visited: boolean
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
  visited: true,
  apps: [[]],
}

/**
 * Actions
 */

export const loadApps = createAsyncThunk<Partial<State>, void, { state: any }>(
  `${NAME}/loadApps`,
  async (_, { getState }) => {
    const {
      wallet: { address },
    } = getState()
    if (!account.isAddress(address))
      throw new Error('Wallet is not connected yet')
    const db = new PDB(address).createInstance('senos')
    const visited = (await db.getItem('visited')) || false
    const apps = troubleshoot((await db.getItem('apps')) || initialState.apps)
    return { visited, apps }
  },
)

export const installApp = createAsyncThunk<
  Partial<State>,
  string,
  { state: any }
>(`${NAME}/installApp`, async (appName, { getState }) => {
  const {
    wallet: { address },
    babysitter: { apps },
  } = getState()
  if (!account.isAddress(address))
    throw new Error('Wallet is not connected yet')
  if (apps.flat().includes(appName)) return {}
  const newApps: Apps = apps.map((page: string[]) => [...page])
  newApps[newApps.length - 1].push(appName)
  const pdb = new PDB(address)
  await pdb.createInstance('senos').setItem('apps', newApps)
  return { apps: newApps }
})

export const updateApps = createAsyncThunk<
  Partial<State>,
  Apps,
  { state: any }
>(`${NAME}/updateApps`, async (apps, { getState }) => {
  const {
    wallet: { address },
  } = getState()
  if (!account.isAddress(address))
    throw new Error('Wallet is not connected yet')
  apps = troubleshoot(apps)
  const pdb = new PDB(address)
  await pdb.createInstance('senos').setItem('apps', apps)
  return { apps }
})

export const uninstallApp = createAsyncThunk<
  Partial<State>,
  string,
  { state: any }
>(`${NAME}/uninstallApp`, async (appName, { getState }) => {
  const {
    wallet: { address },
    babysitter: { apps },
  } = getState()
  if (!account.isAddress(address))
    throw new Error('Wallet is not connected yet')
  if (!apps.flat().includes(appName)) return {}
  const newApps = apps.map((page: string[]) =>
    page.filter((name) => name !== appName),
  )
  const pdb = new PDB(address)
  await pdb.createInstance('senos').setItem('apps', newApps)
  await pdb.dropInstance(appName)
  return { apps: newApps }
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
        loadApps.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        installApp.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        updateApps.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        uninstallApp.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
