import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import ssjs from 'senswapjs';

import { Row, Col } from 'sen-kit';
import Search from './search';

import { DynamicLogo } from 'helpers/loader';
import { updateApps } from 'store/installer.reducer';


class Market extends Component {
  constructor() {
    super();

    this.state = {
      appNames: ['Sen Template', 'Pokemon Deck']
    }
  }

  installApp = async (appName) => {
    const { installer: { address, apps }, updateApps } = this.props;
    if (!ssjs.isAddress(address) || apps.includes(appName)) return;
    const newApps = [...apps];
    newApps.push(appName);
    return await updateApps(newApps);
  }

  render() {
    const { appNames } = this.state;

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Search />
      </Col>
      <Col span={24} style={{ height: 32 }} />
      <Col span={24}>
        <Row gutter={[16, 16]}>
          {appNames.map((appName, i) => <Col key={i}>
            <DynamicLogo name={appName} onClick={() => this.installApp(appName)} />
          </Col>)}
        </Row>
      </Col>
    </Row>
  }
}

const mapStateToProps = state => ({
  installer: state.installer,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateApps,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Market));