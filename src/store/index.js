import { configureStore } from '@reduxjs/toolkit';
import middleware from './middleware';
import devTools from './devTools';

import ui from './ui.reducer';
import wallet from './wallet.reducer';

const store = configureStore({
  middleware,
  devTools,
  reducer: {
    ui,
    wallet,
  },
});

export default store;