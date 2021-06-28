import React, { Suspense, lazy } from 'react';
import { nanoid } from '@reduxjs/toolkit';

import util from 'helpers/util';
import AppLoading from 'components/appLoading';
import AppLogo from 'components/appLogo';

/**
 * Logo Loader
 */
const loadLogo = (name, props) => {
  const folderName = util.normalizeAppName(name);
  let src = '';
  try { src = require(`applications/${folderName}/icon.png`).default } catch (er) { /* Nothing */ }
  return <AppLogo name={name} src={src} {...props} />
}

/**
 * App Loader
 */
const loadApp = (name) => {
  const folderName = util.normalizeAppName(name);
  const Application = lazy(async () => {
    try {
      return await import(`applications/${folderName}/index`);
    } catch (er) {
      return await import('components/appGuard');
    }
  });
  return <Suspense key={nanoid()} fallback={<AppLoading />}>
    <Application name={name} />
  </Suspense>
}

export { loadApp, loadLogo }