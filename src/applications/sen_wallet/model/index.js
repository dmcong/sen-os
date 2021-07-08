import { configureStore } from '@reduxjs/toolkit';
import middleware from 'store/middleware';
import devTools from 'store/devTools';

import { appName } from '../package.json';
import main from '../controller/main.controller';
import bucket from '../controller/bucket.controller';
import cgk from '../controller/cgk.controller';

/**
 * Isolated store
 */
const model = configureStore({
  middleware,
  devTools: devTools(appName),
  reducer: {
    main,
    bucket,
    cgk,
  },
});

export default model;