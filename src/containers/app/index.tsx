import { Route, Switch, Redirect } from 'react-router-dom'

import { Layout, Row, Col } from '@senswap/sen-ui'

import Utility from 'containers/utility'
import ControlCenter from 'containers/controlCenter'
import Welcome from 'containers/welcome'
import Home from 'containers/home'
import Market from 'containers/market'
import AppViewer from 'containers/market/appViewer'

const App = () => {
  return (
    <Layout style={{ backgroundColor: '#00000000' }}>
      <Layout.Content style={{ padding: '12px 8px' }}>
        <Row gutter={[16, 16]} justify="center">
          <Col span={24} style={{ maxWidth: 1920 }}>
            <Switch>
              <Route exact path="/welcome" component={Welcome} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/market" component={Market} />
              <Route exact path="/market/:appName" component={AppViewer} />
              <Redirect from="*" to="/welcome" />
            </Switch>
          </Col>
          <Col span={24} style={{ height: 64 }} /> {/* Safe space */}
        </Row>
      </Layout.Content>
      <ControlCenter />
      <Utility />
    </Layout>
  )
}

export default App
