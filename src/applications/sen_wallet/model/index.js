import { configureStore } from '@reduxjs/toolkit'
import middleware from 'store/middleware'
import devTools from 'store/devTools'

import { appName } from '../package.json'
import mints from '../controller/mints.controller'
import accounts from '../controller/accounts.controller'
import cgk from '../controller/cgk.controller'

/**
 * Isolated store
 */
const model = configureStore({
  middleware,
  devTools: devTools(appName),
  reducer: {
    mints,
    accounts,
    cgk,
  },
})

export default model
