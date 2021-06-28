import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col, Typography, Widget, Button, Icon } from 'sen-kit';

import AppLoading from 'components/appLoading';
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
      retrying: false,
      error: '',
      info: '',
    }
  }

  componentDidCatch(error, info) {
    return this.setState({ error, info });
  }

  retry = () => {
    return this.setState({ retrying: true }, () => {
      return setTimeout(() => {
        return this.setState({ retrying: false });
      }, 1000);
    });
  }

  remove = () => {
    // Not yet
  }

  support = () => {
    const { author: { email }, name } = metadata;
    return window.open(`mailto:${email}?subject=${name} has failed`, '_blank');
  }

  render() {
    const { error, retrying } = this.state;
    const { name, version } = metadata;

    // Dirty retry
    if (retrying) return <AppLoading />
    // Catch error
    if (error) return <Widget type="glass">
      <Row gutter={[16, 16]} >
        <Col span={24} style={{ height: 64 }} />
        <Col span={24}>
          <Typography.Title level={3} align="center">{name}</Typography.Title>
          <p style={{ marginTop: -12 }} align="center">Version {version}</p>
        </Col>
        <Col span={24} />
        <Col span={24}>
          <p align="center">Oops! The application couldn't load properly</p>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]} justify="center" align="middle" >
            <Col span={24}>
              <Button
                type="primary"
                icon={<Icon name="reload-outline" />}
                onClick={this.retry}
                block
              >Retry</Button>
            </Col>
            <Col span={12}>
              <Button
                type="text"
                icon={<Icon name="trash-outline" />}
                onClick={this.remove}
                className="btnContained"
                block
              >Remove</Button>
            </Col>
            <Col span={12}>
              <Button
                type="text"
                icon={<Icon name="help-buoy-outline" />}
                onClick={this.support}
                className="btnContained"
                block
              >Support</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Widget>
    // Main app
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