import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import ssjs from 'senswapjs';

import { Button } from 'sen-kit';

import Login from '../login';
import { openWallet, disconnectWallet } from 'store/wallet.reducer';

const ConnectWalletButton = (props) => {
  const address = useSelector((state) => state.wallet.address)
  const dispatch = useDispatch();
  const connect = () => dispatch(openWallet());
  const disconnect = () => dispatch(disconnectWallet());
  const { type, block } = props;
  if (!ssjs.isAddress(address)) return <Fragment>
    <Button type={type} onClick={connect} block={block}>Connect Wallet</Button>
    <Login />
  </Fragment>
  return <Button type={type} onClick={disconnect} block={block}>Disconnect</Button>
}

ConnectWalletButton.defaultProps = {
  type: 'primary',
  block: true,
}

ConnectWalletButton.propTypes = {
  type: PropTypes.string,
  block: PropTypes.bool,
}

export default ConnectWalletButton;