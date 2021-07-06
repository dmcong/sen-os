import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import universe from 'universe.json';

import { Row, Col, Typography } from 'sen-kit';
import AppPanelInMarket from './appPanelInMarket';


class Foundation extends Component {
  constructor() {
    super();

    this.state = {
      appNames: Object.keys(universe)
        .map(id => universe[id])
        .filter(({ author: { name } }) => (name === 'SenSwap'))
        .map(({ appName }) => appName)
    }
  }

  to = (appName = '') => {
    const { history } = this.props;
    const subRoute = encodeURI(appName)
    return history.push(`/market/${subRoute}`);
  }

  render() {
    const { appNames } = this.state;

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={4} style={{ margin: '0px 8px' }}>By SenSwap</Typography.Title>
      </Col>
      {appNames.map(appName => <Col
        key={appName}
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 6 }}
      >
        <AppPanelInMarket appName={appName} onClick={() => this.to(appName)} />
      </Col>)}
    </Row>
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Foundation));