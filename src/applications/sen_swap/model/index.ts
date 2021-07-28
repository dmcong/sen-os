import { configureStore } from '@reduxjs/toolkit'
import middleware from 'store/middleware'
import devTools from 'store/devTools'

import { appName } from '../package.json'
import accounts from '../controller/accounts.controller'
import pools from '../controller/pools.controller'
import settings from '../controller/settings.controller'
import bid from '../controller/bid.controller'
import ask from '../controller/ask.controller'

/**
 * Isolated store
 */
const model = configureStore({
  middleware,
  devTools: devTools(appName),
  reducer: {
    accounts,
    pools,
    settings,
    bid,
    ask,
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
