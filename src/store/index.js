import { configureStore } from '@reduxjs/toolkit';
import wallet from './wallet.reducer';

const store = configureStore({
  reducer: {
    wallet
  },
});

export default store;