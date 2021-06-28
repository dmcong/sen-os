import React, { Suspense, lazy } from 'react';
import { nanoid } from '@reduxjs/toolkit';

import util from 'helpers/util';
import AppLoading from 'components/appLoading';

/**
 * App Loader
 */
const load = (appName) => {
  try {
    const folderName = util.normalizeAppName(appName);
    const Application = lazy(async () => {
      try {
        return await import(`applications/${folderName}/index.js`);
      } catch (er) {
        return await import('components/appGuard');
      }
    });
    return <Suspense key={nanoid()} fallback={<AppLoading />}>
      <Application appName={appName} />
    </Suspense>
  } catch (er) {
    return
  }
}

export { load }