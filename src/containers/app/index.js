import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { Layout, Row, Col } from 'sen-kit';

import UiUx from 'containers/uiux';
import ControlCenter from 'containers/controlCenter';
import Home from 'containers/home';
import Market from 'containers/market';


class App extends Component {
  render() {
    return <Layout style={{ backgroundColor: '#00000000' }}>
      <Layout.Content style={{ padding: 8 }}>
        <Row gutter={[16, 16]} justify="center">
          <Col span={24} style={{ maxWidth: 1440 }}>
            <Switch>
              <Route exact path='/home' component={Home} />
              <Route exact path='/market' component={Market} />
              <Redirect from='*' to={'/home'} />
            </Switch>
          </Col>
          <Col span={24} style={{ height: 64 }} /> {/* Safe space */}
        </Row>
      </Layout.Content>
      <ControlCenter />
      <UiUx />
    </Layout>
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
