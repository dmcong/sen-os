import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import util from 'helpers/util'
import { API_URL } from '../config/config'
import { appName } from '../package.json'

const NAME = util.normalizeAppName(appName)
const initialState = {}

/**
 * Actions
 */

export const loadCollection = createAsyncThunk(
  `${NAME}/documents`,
  async (data, { getState }) => {
    const { collectionName } = data
    const state = getState()

    if (state.collection[collectionName]) return {}
    const response = await axios({
      method: 'get',
      url: `${API_URL}/system/${state.main.deployID}/collection/${collectionName}`,
      data: data,
      headers: {},
    })

    const collectionData = response.data.data
    return { [collectionName]: collectionData }
  },
)

// export const closeGModal = createAsyncThunk(`${NAME}/close`, async () => {
//   return { isOpen: false, dom: null }
// })

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: (builder) =>
    void builder.addCase(
      loadCollection.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
  //   .addCase(
  //     closeGModal.fulfilled,
  //     (state, { payload }) => void Object.assign(state, payload),
  //   ),
})

export default slice.reducer
