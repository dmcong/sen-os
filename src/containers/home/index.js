import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import isEqual from 'react-fast-compare';
import ssjs from 'senswapjs';

import { Row } from 'sen-kit';
import Wallet from 'containers/wallet';

import { DynamicApp } from 'helpers/loader';
import { loadApps } from 'store/installer.reducer';


class Home extends Component {

  componentDidMount() {
    this.loadMyApps();
  }

  componentDidUpdate(prevProps) {
    const { wallet: { address: prevAddress } } = prevProps;
    const { wallet: { address } } = this.props;
    if (!isEqual(prevAddress, address)) this.loadMyApps();
  }

  loadMyApps = async () => {
    const { wallet: { address }, loadApps } = this.props;
    if (!ssjs.isAddress(address)) return;
    return await loadApps(address);
  }

  render() {
    const { installer: { apps } } = this.props;

    return <Row gutter={[16, 16]}>
      <Wallet />
      {apps.map(appName => <DynamicApp key={appName} name={appName} />)}
    </Row>
  }
}

const mapStateToProps = state => ({
  wallet: state.wallet,
  installer: state.installer,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  loadApps,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Home));