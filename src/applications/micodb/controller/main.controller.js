import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import util from 'helpers/util'
import { API_URL } from '../config/config'
import { appName } from '../package.json'

const NAME = util.normalizeAppName(appName)
const initialState = {
  deployID: '',
  listCollection: [],
}

/**
 * Actions
 */

export const connectDatabase = createAsyncThunk(
  `${NAME}/connect`,
  async (payload) => {
    const { deployID } = payload

    const response = await axios({
      method: 'get',
      url: `${API_URL}/system/${deployID}/collection`,
      data: {},
      headers: {},
    })

    const {
      data: { status, data: listCollection },
    } = response
    console.log('response', response)
    if (status !== true) return

    return { deployID: deployID, listCollection }
  },
)

export const createCollection = createAsyncThunk(
  `${NAME}/createCollection`,
  async (data, { getState }) => {
    const state = getState()
    const response = await axios({
      method: 'post',
      url: `${API_URL}/system/${state.main.deployID}/collection`,
      data: data,
      headers: {},
    })
    const { status } = response.data
    if (!status) return
    const listCollection = [data.collection, ...state.main.listCollection]
    return { listCollection }
  },
)

export const disconnectDatabase = createAsyncThunk(
  `${NAME}/disconnect`,
  async () => {
    return { deployID: '' }
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
        connectDatabase.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        disconnectDatabase.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        createCollection.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
