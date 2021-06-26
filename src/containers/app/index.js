import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { Layout, Row, Col } from 'sen-kit';

import UiUx from 'containers/uiux';
import ControlCenter from 'containers/controlCenter';
import Home from 'containers/home';


class App extends Component {
  render() {
    const { ui: { spacing } } = this.props;

    return <Layout style={{ backgroundColor: '#00000000' }}>
      <Layout.Content style={{ padding: spacing / 2 }}>
        <Row gutter={[spacing, spacing]} justify="center">
          <Col span={24} style={{ maxWidth: 1400 }}>
            <Switch>
              <Redirect exact from="/" to="/home" />
              <Route path='/home' component={Home} />
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
  ui: state.ui,
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
