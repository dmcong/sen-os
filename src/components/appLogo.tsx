import { forwardRef } from 'react'

import { Row, Col, Typography } from '@senswap/sen-ui'

import util from 'helpers/util'

/**
 * Application Logo
 */
const AppLogo = forwardRef(
  (
    {
      name,
      src = '#',
      title = true,
      style: userStyle,
      ...rest
    }: { name: string; src?: string; title?: boolean; style?: object },
    ref,
  ) => {
    // Infer color
    const bgColor = util.randomColor(util.normalizeAppName(name), 'light')
    const symbol = name.substring(0, 2)
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
      <Row
        style={{ width: 64, cursor: 'pointer', ...userStyle }}
        gutter={[0, 8]}
        {...rest}
        ref={ref}
      >
        <Col span={24}>
          <Row style={{ height: 64, borderRadius: 16, ...bg }} justify="center" align="middle">
            {src ? null : (
              <Col>
                <Typography.Title level={1} style={{ marginBottom: 4, color: txtColor }}>
                  {symbol}
                </Typography.Title>
              </Col>
            )}
          </Row>
        </Col>
        {title ? (
          <Col span={24}>
            <p style={{ fontSize: 10, margin: 0, textAlign: 'center' }}>{name}</p>
          </Col>
        ) : null}
      </Row>
    )
  },
)

export default AppLogo
