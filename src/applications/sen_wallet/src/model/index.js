import { configureStore } from '@reduxjs/toolkit';
import middleware from 'store/middleware';
import devTools from 'store/devTools';

import main from '../controller/main.controller';

/**
 * Isolated store
 */
const model = configureStore({
  middleware,
  devTools,
  reducer: {
    main,
  },
});

export default model;