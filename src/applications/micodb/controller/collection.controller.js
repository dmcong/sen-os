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
    const { collectionName, force } = data
    const { main, collection } = getState()

    if (collection[collectionName] && force !== true)
      return collection[collectionName]

    //Load Config Collection
    const configFetch = axios({
      method: 'get',
      url: `${API_URL}/system/${main.deployID}/collection/${collectionName}`,
      data: data,
      headers: {},
    }).then((data) => data.data.data)

    //Load All Documents in Collection
    const docsFetch = axios({
      method: 'post',
      url: `${API_URL}/micodb/${main.deployID}/${collectionName}/search`,
      data: data,
      headers: {},
    }).then((data) => data.data.data)
    const collectionData = await Promise.all([configFetch, docsFetch])

    return {
      [collectionName]: {
        ...collectionData[0],
        documents: collectionData[1],
      },
    }
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
