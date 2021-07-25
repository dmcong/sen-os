import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Row, Col, Typography } from '@senswap/sen-ui'
import AppTicket from './appTicket'

import universe from 'universe.json'
import { installApp } from 'store/babysitter.reducer'
import { RootDispatch, RootState } from 'store'

const Community = () => {
  const appNames = Object.keys(universe)
    .map((id: string) => (universe as Universe)[id])
    .filter(({ author: { name } }) => name !== 'SenSwap')
    .map(({ appName }) => appName)

  const history = useHistory()
  const dispatch = useDispatch<RootDispatch>()
  const { apps } = useSelector((state: RootState) => state.babysitter)
  const { address } = useSelector((state: RootState) => state.wallet)

  const to = (appName = '') => {
    const subRoute = encodeURI(appName)
    return history.push(`/market/${subRoute}`)
  }

  const isInstalled = (appName: string) => {
    return account.isAddress(address) && apps.flat().includes(appName)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={4} style={{ margin: '0px 8px' }}>
          By Community
        </Typography.Title>
      </Col>
      {appNames.map((appName) => (
        <Col key={appName} xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
          <AppTicket
            appName={appName}
            installed={isInstalled(appName)}
            onClick={() => to(appName)}
            onAdd={() => dispatch(installApp(appName))}
          />
        </Col>
      ))}
    </Row>
  )
}

export default Community
