import { configureStore } from '@reduxjs/toolkit'
import middleware from 'store/middleware'
import devTools from 'store/devTools'

import { appName } from '../package.json'
import lpts from '../controller/lpts.controller'
import pools from '../controller/pools.controller'

/**
 * Isolated store
 */
const model = configureStore({
  middleware,
  devTools: devTools(appName),
  reducer: {
    lpts,
    pools,
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
