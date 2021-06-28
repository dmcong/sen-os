import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col, Typography, Widget, Button, Icon } from 'sen-kit';

import metadata from './package.json';
import View from './view';
import model from './model';

/**
 * Error Boundary
 */
class ErrorBoundary extends Component {
  constructor() {
    super();

    this.state = {
      error: '',
      info: '',
    }
  }

  componentDidCatch(error, info) {
    return this.setState({ error, info });
  }

  remove = () => {
    // Not yet
  }

  support = () => {
    const { email, name } = metadata;
    return window.open(`mailto:${email}?subject=${name} has failed`, '_blank');
  }

  render() {
    const { error } = this.state;
    const { name, version } = metadata;

    if (error) return <Widget type="glass">
      <Row gutter={[16, 16]} >
        <Col span={24} style={{ height: 80 }} />
        <Col span={24}>
          <Typography.Title level={3} align="center">{name}</Typography.Title>
          <p align="center">Version {version}</p>
        </Col>
        <Col span={24}>
          <Typography.Title level={5} align="center">Oops! The application couldn't load properly</Typography.Title>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]} justify="center" align="middle" >
            <Col>
              <Button
                type="primary"
                icon={<Icon name="trash-outline" />}
                onClick={this.remove}
              >Remove</Button>
            </Col>
            <Col>
              <Button
                type="text"
                icon={<Icon name="help-buoy-outline" />}
                onClick={this.support}
              >Support</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Widget>
    return this.props.children;
  }
}

/**
 * Application
 */
class Main extends Component {

  render() {
    const { ui, wallet } = this.props;
    return <Provider store={model}>
      <ErrorBoundary>
        <View ui={ui} wallet={wallet} />
      </ErrorBoundary>
    </Provider>
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
  wallet: state.wallet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Main));