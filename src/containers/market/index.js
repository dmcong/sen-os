import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col, Space } from 'sen-kit';
import Search from './search';
import LogoInMarket from './logoInMarket';

import universe from 'universe.json';

class Market extends Component {
  constructor() {
    super();

    this.state = {
      appNames: Object.keys(universe).map(id => universe[id].appName)
    }
  }

  to = (appName = '') => {
    const { history } = this.props;
    const subRoute = encodeURI(appName)
    return history.push(`/market/${subRoute}`);
  }

  render() {
    const { appNames } = this.state;
    const { babysitter: { apps } } = this.props;

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Search />
      </Col>
      <Col span={24} style={{ height: 32 }} />
      <Col span={24}>
        <Space size={24} align="start">
          {appNames.map(appName => <LogoInMarket
            key={appName}
            installed={apps.flat().includes(appName)}
            name={appName}
            onClick={() => this.to(appName)}
          />)}
        </Space>
      </Col>
    </Row >
  }
}

const mapStateToProps = state => ({
  babysitter: state.babysitter,
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Market));