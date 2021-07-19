import { Suspense, lazy, useMemo, forwardRef } from 'react'

import util from 'helpers/util'
import AppLoading from 'components/appLoading'
import AppLogo from 'components/appLogo'
import AppPanel from 'components/appPanel'

const metadata = (appName: string) => {
  const folderName = util.normalizeAppName(appName)
  try {
    return require(`applications/${folderName}/package.json`)
  } catch (er) {
    return {}
  }
}

/**
 * Logo Loader
 */
const DynamicLogo = forwardRef<HTMLElement, any>(({ name, ...rest }, ref) => {
  const folderName = util.normalizeAppName(name)
  let src = ''
  try {
    src = require(`applications/${folderName}/assets/icon.png`).default
  } catch (er) {
    /* Nothing */
  }
  return <AppLogo name={name} src={src} {...rest} ref={ref} />
})

/**
 * Panel Loader
 */
const DynamicPanel = forwardRef<HTMLElement, any>(
  ({ appName, ...rest }, ref) => {
    const folderName = util.normalizeAppName(appName)
    let src = ''
    try {
      src = require(`applications/${folderName}/assets/panel.png`).default
    } catch (er) {
      /* Nothing */
    }
    return <AppPanel appName={appName} src={src} {...rest} ref={ref} />
  },
)

/**
 * App Loader
 */
const DynamicApp = forwardRef<HTMLElement, any>(({ appName, ...rest }, ref) => {
  const folderName = util.normalizeAppName(appName)
  const Application = useMemo(
    () =>
      lazy(async () => {
        try {
          return await import(`applications/${folderName}/index`)
        } catch (er) {
          return await import('components/errorBoundary')
        }
      }),
    [folderName],
  )
  return (
    <Suspense fallback={<AppLoading />}>
      <Application appName={appName} {...rest} ref={ref} />
    </Suspense>
  )
})

export { DynamicLogo, DynamicPanel, DynamicApp }
export default metadata
