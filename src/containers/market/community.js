import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import ssjs from 'senswapjs';
import universe from 'universe.json';

import { Row, Col, Typography } from 'sen-kit';
import AppTicket from './appTicket';

import { updateApps } from 'store/babysitter.reducer';


class Community extends Component {
  constructor() {
    super();

    this.state = {
      appNames: Object.keys(universe)
        .map(id => universe[id])
        .filter(({ author: { name } }) => (name !== 'SenSwap'))
        .map(({ appName }) => appName)
    }
  }

  to = (appName = '') => {
    const { history } = this.props;
    const subRoute = encodeURI(appName)
    return history.push(`/market/${subRoute}`);
  }

  installApp = async (appName) => {
    const { babysitter: { apps }, updateApps } = this.props;
    if (this.isInstalled(appName)) return;
    const newApps = apps.map(page => [...page]);
    newApps[newApps.length - 1].push(appName);
    return await updateApps(newApps);
  }

  isInstalled = (appName) => {
    const { babysitter: { address, apps } } = this.props;
    return ssjs.isAddress(address) && apps.flat().includes(appName);
  }

  render() {
    const { babysitter: { apps } } = this.props;
    const { appNames } = this.state;

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={4} style={{ margin: '0px 8px' }}>By Community</Typography.Title>
      </Col>
      {appNames.map(appName => <Col
        key={appName}
        xs={{ span: 24 }}
        md={{ span: 12 }}
        lg={{ span: 8 }}
      >
        <AppTicket
          appName={appName}
          installed={apps.flat().includes(appName)}
          onClick={() => this.to(appName)}
          onAdd={() => this.installApp(appName)}
        />
      </Col>)}
    </Row>
  }
}

const mapStateToProps = state => ({
  babysitter: state.babysitter,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateApps,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Community));