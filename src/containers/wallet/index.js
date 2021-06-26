import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import ssjs from 'senswapjs';

import { Row, Col, Typography, Widget } from 'sen-kit';

import configs from 'configs';
import ConnectWalletButton from './plugin/connectWalletButton';

class Wallet extends Component {
  constructor() {
    super();

    const { sol: { node } } = configs;
    window.senos = {
      lamports: new ssjs.Lamports(node),
    }
  }

  render() {
    return <Widget variant="glass" size="small">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={1}>Wallet</Typography.Title>
        </Col>
        <Col span={24}>
          <ConnectWalletButton />
        </Col>
      </Row>
    </Widget>
  }
}

const mapStateToProps = state => ({
  wallet: state.wallet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet));