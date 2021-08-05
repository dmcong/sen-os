import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import util from 'helpers/util'
import { appName } from '../package.json'

const NAME = util.normalizeAppName(appName)
const initialState = {
  'daily-report': {
    documents: [
      {
        _id: 1,
        address: 'AFEq7oc7zcrJHTnca2UrDiShfoSCr7izZaXjZRw5hQ1S',
        mintLPT: '6PrcHojqeewhJwZphSzo2srSJLkhhSVPYyoNbQ3DSNfM',
        createdAt: 20210712,
        updatedAt: 20210712,
      },
      {
        _id: 2,
        address: 'AFEq7oc7zcrJHTnca2UrDiShfoSCr7izZaXjZRw5hQ1S',
        mintLPT: '6PrcHojqeewhJwZphSzo2srSJLkhhSVPYyoNbQ3DSNfM',
        createdAt: 20210712,
        updatedAt: 20210712,
      },
      {
        _id: 3,
        address: 'AFEq7oc7zcrJHTnca2UrDiShfoSCr7izZaXjZRw5hQ1S',
        mintLPT: '6PrcHojqeewhJwZphSzo2srSJLkhhSVPYyoNbQ3DSNfM',
        createdAt: 20210712,
        updatedAt: 20210712,
      },
    ],
    schema: {
      address: 'string',
      mintLPT: 'string',
      createdAt: 'number',
      updatedAt: 'number',
    },
    api: {
      create: {
        method: 'POST',
        url: '/daily-report',
      },
      update: {
        method: 'PUT',
        url: '/daily-report/:id',
      },
      delete: {
        method: 'DELETE',
        url: '/daily-report/:id',
      },
      find: {
        method: 'GET',
        url: '/daily-report/:id',
      },
      findAll: {
        method: 'GET',
        url: '/daily-report',
      },
    },
  },
}

/**
 * Actions
 */

export const loadCollection = createAsyncThunk(
  `${NAME}/documents`,
  async (data, state) => {
    const { collectionName } = data
    const collectionData = {
      documents: [
        {
          _id: 1,
          address: 'AFEq7oc7zcrJHTnca2UrDiShfoSCr7izZaXjZRw5hQ1S',
          mintLPT: '6PrcHojqeewhJwZphSzo2srSJLkhhSVPYyoNbQ3DSNfM',
          createdAt: 20210712,
          updatedAt: 20210712,
        },
        {
          _id: 2,
          address: 'AFEq7oc7zcrJHTnca2UrDiShfoSCr7izZaXjZRw5hQ1S',
          mintLPT: '6PrcHojqeewhJwZphSzo2srSJLkhhSVPYyoNbQ3DSNfM',
          createdAt: 20210712,
          updatedAt: 20210712,
        },
        {
          _id: 3,
          address: 'AFEq7oc7zcrJHTnca2UrDiShfoSCr7izZaXjZRw5hQ1S',
          mintLPT: '6PrcHojqeewhJwZphSzo2srSJLkhhSVPYyoNbQ3DSNfM',
          createdAt: 20210712,
          updatedAt: 20210712,
        },
      ],
      schema: {
        address: 'string',
        mintLPT: 'string',
        createdAt: 'number',
        updatedAt: 'number',
      },
      listAPI: [
        {
          method: 'POST',
          url: `/${collectionName}`,
          title: `Create one`,
        },
        {
          method: 'PUT',
          url: `/${collectionName}/:id`,
          title: `Update one with _id`,
        },
        {
          method: 'DELETE',
          url: `/${collectionName}/:id`,
          title: `Delete one with _id`,
        },
        {
          method: 'GET',
          url: `/${collectionName}/:id`,
          title: `Find one with _id`,
        },
        {
          method: 'GET',
          url: `/${collectionName}`,
          title: `Find all`,
        },
      ],
    }
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
