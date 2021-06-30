import { configureStore } from '@reduxjs/toolkit';

import main from '../controller/main.controller';

/**
 * Isolated store
 */
const model = configureStore({
  reducer: {
    main,
  },
  // Bugfix: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#excessive-use-of-memory-and-cpu
  devTools: {
    actionSanitizer: ({ payload, type }) => ({ payload, type }),
  }
});

export default model;