import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import ssjs from 'senswapjs';
import isEqual from 'react-fast-compare';

import { withSenOs } from 'helpers/senos';
import { updateWallet } from 'store/wallet.reducer';


class WalletWatcher extends Component {

  componentDidMount() {
    this.watchData();
  }

  componentDidUpdate(prevProps) {
    const { wallet: { address: prevAddress } } = prevProps;
    const { wallet: { address } } = this.props;
    if (!isEqual(prevAddress, address)) this.watchData();
  }

  componentWillUnmount() {
    return this.unwatchData();
  }

  watchData = () => {
    const { wallet: { address }, updateWallet } = this.props;
    if (!ssjs.isAddress(address)) return this.unwatchData();
    if (this.watchId) return console.warn('Already watched');
    const callback = (er, re) => {
      if (er) return console.error(er);
      return updateWallet({ lamports: re });
    }
    this.watchId = window.senos.lamports.watch(address, callback);
  }

  unwatchData = async () => {
    try { await window.senos.lamports.unwatch(this.watchId) } catch (er) { /* Nothing */ }
    this.watchId = null;
  }

  render() {
    return <Fragment />
  }
}

const mapStateToProps = state => ({
  wallet: state.wallet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateWallet
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withSenOs(WalletWatcher)));