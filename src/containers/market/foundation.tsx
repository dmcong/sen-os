import { useHistory } from 'react-router-dom'
import universe from 'universe.json'

import { Row, Col, Typography } from '@senswap/sen-ui'
import AppPanelInMarket from './appPanelInMarket'

const Foundation = () => {
  const history = useHistory()
  const appNames = Object.keys(universe)
    .map((id: string) => (universe as Universe)[id])
    .filter(({ author: { name } }) => name === 'SenSwap')
    .map(({ appName }) => appName)

  const to = (appName = '') => {
    const subRoute = encodeURI(appName)
    return history.push(`/market/${subRoute}`)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={4} style={{ margin: '0px 8px' }}>
          By SenSwap
        </Typography.Title>
      </Col>
      {appNames.map((appName) => (
        <Col
          key={appName}
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 6 }}
        >
          <AppPanelInMarket appName={appName} onClick={() => to(appName)} />
        </Col>
      ))}
    </Row>
  )
}

export default Foundation
