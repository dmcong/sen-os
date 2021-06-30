import { configureStore } from '@reduxjs/toolkit';

import main from '../controller/main.controller';

/**
 * Isolated store
 */
const model = configureStore({
  reducer: {
    main,
  },
});

export default model;