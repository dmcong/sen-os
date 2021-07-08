import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import ssjs from 'senswapjs';
import isEqual from 'react-fast-compare';

import { withSenOs } from 'helpers/senos';
import { getAccounts } from '@/sen_wallet/controller/main.controller';
import { upsetData, upsetBatch } from '@/sen_wallet/controller/bucket.controller';


class BucketWatcher extends Component {

  componentDidMount() {
    this.fetchData();
    this.watchData();
  }

  componentDidUpdate(prevProps) {
    const { senos: { wallet: { address: prevAddress } } } = prevProps;
    const { senos: { wallet: { address } } } = this.props;
    if (!isEqual(prevAddress, address)) {
      this.fetchData();
      this.watchData();
    }
  }

  componentWillUnmount() {
    return this.unwatchData();
  }

  fetchData = async () => {
    const { senos: { wallet: { address }, notify }, getAccounts, upsetBatch } = this.props;
    if (!ssjs.isAddress(address)) return;
    const { error, meta: { data } } = await getAccounts(address);
    if (error) return await notify({ type: 'error', description: error.message });
    await upsetBatch(data);
  }

  watchData = () => {
    const { senos: { wallet: { address } }, upsetData } = this.props;
    if (!ssjs.isAddress(address)) return this.unwatchData();
    if (this.watchId) return console.log('Already watched');
    const callback = (er, re) => {
      if (er) return;
      return upsetData(re);
    }
    const filters = [{ memcmp: { bytes: address, offset: 32 } }];
    this.watchId = window.senos.splt.watch(callback, filters);
  }

  unwatchData = () => {
    window.senos.splt.unwatch(this.watchId);
    this.watchId = null;
  }

  render() {
    return <Fragment />
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getAccounts,
  upsetData, upsetBatch
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withSenOs(BucketWatcher)));