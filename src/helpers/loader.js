import React, { Suspense, lazy } from 'react';
import { nanoid } from '@reduxjs/toolkit';

import util from 'helpers/util';
import AppLoading from 'components/appLoading';
import LogoLoading from 'components/logoLoading';

/**
 * Logo Loader
 */
const loadLogo = (name) => {
  const folderName = util.normalizeAppName(name);
  const Logo = lazy(async () => {
    try {
      return await import(`applications/${folderName}/icon.png`);
    } catch (er) {
      return await import('components/autoLogo');
    }
  });
  return <Suspense key={nanoid()} fallback={<LogoLoading />}>
    <Logo name={nanoid()} />
  </Suspense>
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