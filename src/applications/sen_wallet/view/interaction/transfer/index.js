import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import ssjs from 'senswapjs';

import { Row, Col, Button } from 'sen-kit';
import Source from './source';
import Destination from './destination';

import { getMint } from '@/sen_wallet/controller/mints.controller';


const Transfer = ({ accountData, reset }) => {
  const [amount, setAmount] = useState('');
  const [dstAddress, setDstAddress] = useState('');
  const [srcError, setSrcError] = useState('');
  const [dstError, setDstError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      setAmount('');
      setDstAddress('');
      setSrcError('');
      setDstError('');
    }
  }, [reset]);

  const { address, mint, symbol, amount: maxAmount } = accountData;
  const transfer = async () => {
    const { error, payload } = await dispatch(getMint(mint));
    if (error) return setDstError(error.message);
    const { [mint]: { decimals } } = payload;
    let value = 0;
    try { value = ssjs.decimalize(amount, decimals) } catch (er) { }
    if (!value) return setSrcError('Invalid amount');
    if (value > maxAmount) return setSrcError('Exceed your available balance');
    if (!ssjs.isAddress(dstAddress)) return setDstError('Invalid receiver address');
    console.log(amount, dstAddress)
  }

  return <Row gutter={[16, 16]}>
    <Col span={24}>
      <Source
        mintAddress={mint}
        accountAddress={address}
        symbol={symbol}
        maxAmount={maxAmount}
        value={amount}
        onChange={value => {
          setSrcError('');
          setAmount(value);
        }}
        error={srcError}
      />
    </Col>
    <Col span={24}>
      <Destination
        mintAddress={mint}
        value={dstAddress}
        onChange={value => {
          setDstError('');
          setDstAddress(value);
        }}
        error={dstError}
      />
    </Col>
    <Col span={24}>
      <Button
        type="primary"
        onClick={transfer}
        block
      >Transfer</Button>
    </Col>
  </Row>
}

Transfer.defaultProps = {
  reset: false,
  accountData: {},
}

Transfer.propTypes = {
  reset: PropTypes.bool,
  accountData: PropTypes.object,
}

export default Transfer;