import { configureStore } from '@reduxjs/toolkit'
import middleware from './middleware'
import devTools from './devTools'

import ui from './ui.reducer'
import wallet from './wallet.reducer'
import babysitter from './babysitter.reducer'
import accounts from './accounts.reducer'

const store = configureStore({
  middleware,
  devTools: devTools('SenOS'),
  reducer: {
    ui,
    wallet,
    babysitter,
    accounts,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch
export default store
