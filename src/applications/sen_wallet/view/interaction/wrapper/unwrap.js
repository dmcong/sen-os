import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import ssjs from 'senswapjs';

import { Row, Col, Button, Input, Typography, Icon, Tooltip } from 'sen-kit';

import util from 'helpers/util';
import { useSenOs } from 'helpers/senos';
import { getMint } from '@/sen_wallet/controller/mints.controller';
import { deleteAccount } from '@/sen_wallet/controller/accounts.controller';


const Unwrap = ({ accountData, reset, onChange }) => {
  const [decimals, setDecimals] = useState(0);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const { address, symbol, amount, mint } = accountData;
  useEffect(() => {
    (async () => {
      const { error, payload } = await dispatch(getMint(mint));
      if (error) return setError(error.message);
      const { [mint]: { decimals } } = payload;
      setDecimals(decimals);
    })();
  }, [dispatch, mint]);
  useEffect(() => {
    return () => {
      setDecimals(0);
      setError('');
    }
  }, [reset]);

  const wsol = ssjs.undecimalize(amount, decimals);
  const { senos: { notify } } = useSenOs();
  const unwrap = async () => {
    try {
      const { splt, wallet } = window.senos;
      const { txId } = await splt.unwrap(wallet);
      await dispatch(deleteAccount({ address }));
      await notify({
        type: 'success',
        description: `Unwrap ${wsol} ${symbol} successfully. Click to view details.`,
        onClick: () => window.open(util.explorer(txId), '_blank')
      });
      return onChange(txId);
    } catch (er) {
      return setError(er.message);
    }
  }

  return <Row gutter={[8, 8]}>
    <Col span={24}>
      <Input
        placeholder={0}
        prefix={<Tooltip title={`The ${symbol} associated account: ${address}`}>
          <Button
            type="link"
            style={{ marginLeft: -7, color: 'inherit' }}
            icon={<Icon name="wallet-outline" />}
            href={util.explorer(address)}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!ssjs.isAddress(address)}
          >{symbol}</Button>
        </Tooltip>}
        value={wsol}
      />
    </Col>
    <Col span={24}>
      <Typography.Text type="danger" style={{ fontSize: 11 }} >{error}</Typography.Text>
    </Col>
    <Col span={24}>
      <Button type="primary" onClick={unwrap} block>Unwrap All</Button>
    </Col>
    <Col span={24} style={{ fontSize: 11 }}>
      <Typography.Text type="secondary">Due to technical limitation, you have to:</Typography.Text>
      <ul style={{ paddingLeft: 16 }}>
        <li>
          <Typography.Text type="secondary">Remove all at the time.</Typography.Text>
        </li>
        <li>
          <Typography.Text type="secondary">To increase/decrease the WSOL balance, remove all first and re-wrap your desired number.</Typography.Text>
        </li>
      </ul>
    </Col>
  </Row>
}

Unwrap.defaultProps = {
  reset: false,
  accountData: {},
  onChange: () => { },
}

Unwrap.propTypes = {
  reset: PropTypes.bool,
  accountData: PropTypes.object,
  onChange: PropTypes.func,
}

export default Unwrap;