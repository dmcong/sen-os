import { configureStore } from '@reduxjs/toolkit';

import ui from './ui.reducer';
import wallet from './wallet.reducer';

const store = configureStore({
  reducer: {
    ui,
    wallet,
  },
});

export default store;