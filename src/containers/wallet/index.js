import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import ssjs, { SecretKeyWallet, Coin98Wallet } from 'senswapjs';
import numeral from 'numeral';

import { Row, Col, Typography, Widget, Tooltip } from 'sen-kit';

import configs from 'configs';
import util from 'helpers/util';
import session from 'helpers/session';
import ConnectWalletButton from './plugin/connectWalletButton';
import { connectWallet } from 'store/wallet.reducer';

class Wallet extends Component {
  constructor() {
    super();

    const { sol: { node } } = configs;
    window.senos = {
      lamports: new ssjs.Lamports(node),
    }
  }

  componentDidMount() {
    const { connectWallet } = this.props;
    const wallet = this.reconnect();
    if (wallet) return connectWallet(wallet);
  }

  reconnect = () => {
    const types = ['SecretKey', 'Keystore', 'Coin98'];
    const walletType = session.get('WalletType');
    if (!types.includes(walletType)) return null;
    if (walletType === 'SecretKey') return new SecretKeyWallet(session.get('SecretKey'));
    if (walletType === 'Keystore') return new SecretKeyWallet(session.get('SecretKey'));
    if (walletType === 'Coin98') return new Coin98Wallet();
  }

  render() {
    const { wallet: { address, lamports } } = this.props;


    return <Widget type="glass" size="small">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={1}>Wallet</Typography.Title>
        </Col>
        <Col span={24}>
          <Typography.Link href={util.explorer(address)} target="_blank">{address}</Typography.Link>
        </Col>
        <Col span={24}>
          <Tooltip title={`${ssjs.undecimalize(lamports, 9)} SOL`}>
            <Typography.Text>{numeral(ssjs.undecimalize(lamports, 9)).format('0.[0000]')} SOL</Typography.Text>
          </Tooltip>
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
  connectWallet,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet));