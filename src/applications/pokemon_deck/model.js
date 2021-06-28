import { configureStore } from '@reduxjs/toolkit';

import controller from './controller';

/**
 * Isolated store
 */
const model = configureStore({
  reducer: {
    main: controller,
  },
});

export default model;