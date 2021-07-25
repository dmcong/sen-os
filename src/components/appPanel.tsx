import { forwardRef } from 'react'

import { Typography } from '@senswap/sen-ui'

import util from 'helpers/util'

/**
 * Application Panel
 */
const AppPanel = forwardRef<HTMLDivElement, { appName: string; src?: string }>(
  ({ appName, src = '#' }, ref) => {
    // Infer color
    const bgColor = util.randomColor(util.normalizeAppName(appName), 'light')
    const symbol = appName.substring(0, 2)
    const txtColor = util.randomColor(symbol, 'dark', bgColor)
    // Build background
    const bg = src
      ? {
          backgroundImage: `url("${src}")`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }
      : { backgroundColor: bgColor }
    // Render
    return (
      <div style={{ width: '100%', borderRadius: 16, ...bg }} ref={ref}>
        <div style={{ width: '100%', paddingTop: '75%' }} />
        {src ? null : (
          <div
            style={{
              width: '100%',
              position: 'absolute',
              top: 'calc(50% - 23px)',
              left: 0,
              verticalAlign: 'center',
              textAlign: 'center',
            }}
          >
            <Typography.Title level={1} style={{ marginBottom: 4, color: txtColor }}>
              {appName}
            </Typography.Title>
          </div>
        )}
      </div>
    )
  },
)

export default AppPanel
