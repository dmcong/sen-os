import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import ssjs from 'senswapjs';

import { Button, Icon, Tooltip } from 'sen-kit';

import Login from '../login';
import { openWallet, disconnectWallet } from 'store/wallet.reducer';

const ConnectWalletButton = (props) => {
  const address = useSelector((state) => state.wallet.address)
  const dispatch = useDispatch();
  const connect = () => dispatch(openWallet());
  const disconnect = () => dispatch(disconnectWallet());
  
  const { type, block } = props;
  if (!ssjs.isAddress(address)) return <Fragment>
    <Button
      type={type}
      icon={<Icon name="wallet-outline" />}
      onClick={connect}
      block={block}
    >Connect Wallet</Button>
    <Login />
  </Fragment>
  return <Tooltip title="Disconnect wallet">
    <Button
      type={type}
      icon={<Icon name="power-outline" />}
      onClick={disconnect}
    />
  </Tooltip>
}

ConnectWalletButton.defaultProps = {
  type: 'primary',
  block: false,
}

ConnectWalletButton.propTypes = {
  type: PropTypes.string,
  block: PropTypes.bool,
}

export default ConnectWalletButton;