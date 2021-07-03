import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import ssjs, { SecretKeyWallet, Coin98Wallet } from 'senswapjs';
import numeral from 'numeral';

import { Space, Typography, Tooltip, Button, Icon, Divider } from 'sen-kit';
import Login from './login';

import configs from 'configs';
import util from 'helpers/util';
import session from 'helpers/session';
import { connectWallet, openWallet, disconnectWallet } from 'store/wallet.reducer';

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
    const {
      ui: { infix },
      wallet: { address, lamports }, openWallet, disconnectWallet
    } = this.props;
    const fontSize = infix === 'xs' ? 10 : 12;
    const balance = numeral(ssjs.undecimalize(lamports, 9)).format('0.[00]');

    if (!ssjs.isAddress(address)) return <Fragment>
      <Space size={2}>
        <Typography.Text style={{ fontSize }} >Connect Wallet</Typography.Text>
        <Divider type="vertical" />
        <Button
          type="primary"
          icon={<Icon name="wallet-outline" />}
          onClick={openWallet}
        />
      </Space>
      <Login />
    </Fragment>
    return <Space size={0}>

      <Typography.Link
        style={{ color: '#ffffffd9', fontSize }}
        href={util.explorer(address)}
        target="_blank"
      >{address.substring(0, 4) + '..'} <Icon name="open-outline" /></Typography.Link>
      <Divider type="vertical" />
      <Tooltip title={`${ssjs.undecimalize(lamports, 9)} SOL`}>
        <Typography.Text
          style={{ fontSize }}
        >{balance} <span style={{ color: '#03E1FF' }}>◎</span></Typography.Text>
      </Tooltip>
      <Divider type="vertical" />
      <Button
        type="text"
        className="btnContained"
        icon={<Icon name="power-outline" />}
        onClick={disconnectWallet}
      />
    </Space >
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
  wallet: state.wallet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  connectWallet, openWallet, disconnectWallet,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet));