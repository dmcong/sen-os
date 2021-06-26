import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import ssjs from 'senswapjs';

import { Row, Col, Button, Typography, Widget } from 'sen-kit';

import configs from 'configs';
import Login from './login';
import { openWallet } from 'store/wallet.reducer';

class Wallet extends Component {
  constructor() {
    super();

    const { sol: { node } } = configs;
    window.senos = {
      lamports: new ssjs.Lamports(node),
    }
  }

  render() {
    const { openWallet } = this.props;
    return <Widget variant="glass" size="small">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={1}>Wallet</Typography.Title>
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            onClick={openWallet}
            block
          >Connect Wallet</Button>
        </Col>
      </Row>
      <Login />
    </Widget>
  }
}

const mapStateToProps = state => ({
  wallet: state.wallet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  openWallet,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet));