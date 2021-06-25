import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { Layout, Row, Col } from 'sen-kit';

import UiUx from 'containers/uiux';
import Header from 'containers/header';
import Home from 'containers/home';


class App extends Component {

  render() {
    return <Layout style={{ backgroundColor: '#00000000' }}>
      <Header />
      <Layout.Content style={{ padding: 8 }}>
        <Row gutter={[16, 16]} justify="center">
          <Col span={24} style={{ maxWidth: 1400 }}>
            <Switch>
              <Redirect exact from="/" to="/home" />
              <Route path='/home' component={Home} />
            </Switch>
          </Col>
        </Row>
      </Layout.Content>
      <UiUx />
    </Layout>
  }
}

export default withRouter(App);
