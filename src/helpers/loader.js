import React, { Suspense, lazy, useMemo } from 'react';

import util from 'helpers/util';
import AppLoading from 'components/appLoading';
import AppLogo from 'components/appLogo';

/**
 * Logo Loader
 */
const DynamicLogo = ({ name, ...others }) => {
  const folderName = util.normalizeAppName(name);
  let src = '';
  try { src = require(`applications/${folderName}/assets/icon.png`).default } catch (er) { /* Nothing */ }
  return <AppLogo name={name} src={src} {...others} />
}

/**
 * App Loader
 */
const DynamicApp = ({ name }) => {
  const folderName = util.normalizeAppName(name);
  const Application = useMemo(() => lazy(async () => {
    try {
      return await import(`applications/${folderName}/index`);
    } catch (er) {
      return await import('components/appGuard');
    }
  }), [folderName]);
  return <Suspense fallback={<AppLoading />}>
    <Application name={name} />
  </Suspense>
}

export { DynamicApp, DynamicLogo }