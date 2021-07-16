import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { getMint } from '@/sen_wallet/controller/mints.controller';
import ssjs from 'senswapjs';

import { Row, Col, Input, Typography, Button, Space, Tooltip, Icon } from 'sen-kit';

import util from 'helpers/util';


const DEFAULT_META = { amount: 0n, decimals: 0 }

const Source = ({
  accountAddress, mintAddress, symbol, maxAmount,
  value, onChange, error, onCallback
}) => {
  const [meta, setMeta] = useState({ ...DEFAULT_META });
  const dispatch = useDispatch();

  const balance = ssjs.undecimalize(maxAmount, meta.decimals);
  const handleMax = () => onChange(balance);

  useEffect(() => {
    (async () => {
      let meta = { ...DEFAULT_META }
      try {
        const { error, payload } = await dispatch(getMint({ address: mintAddress }));
        if (error) return setMeta(meta);
        meta.decimals = payload[mintAddress].decimals;
        meta.amount = ssjs.decimalize(value, meta.decimals);
      } catch (er) { /* Skip errors */ }
      return setMeta(meta);
    })();
  }, [mintAddress, value, dispatch]);
  useEffect(() => onCallback({ ...meta }), [meta, onCallback]);

  return <Row gutter={[8, 8]}>
    <Col span={24}>
      <Typography.Text>Amount</Typography.Text>
    </Col>
    <Col span={24}>
      <Input
        placeholder={0}
        prefix={<Tooltip title={`The ${symbol} associated account: ${accountAddress}`}>
          <Button
            type="link"
            style={{ marginLeft: -7, color: 'inherit' }}
            icon={<Icon name="wallet-outline" />}
            href={util.explorer(accountAddress)}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!ssjs.isAddress(accountAddress)}
          >{symbol}</Button>
        </Tooltip>}
        suffix={<Button type="text" style={{ marginRight: -7 }} onClick={handleMax}>MAX</Button>}
        value={value}
        onChange={e => onChange(e.target.value || '')}
      />
    </Col>
    <Col span={24}>
      {error ? <Typography.Text type="danger" style={{ fontSize: 11 }}>
        <Space>
          <Icon name="warning-outline" />
          {error}
        </Space>
      </Typography.Text> : null}
    </Col>
  </Row>
}

Source.defaultProps = {
  accountAddress: '',
  mintAddress: '',
  symbol: 'TOKEN',
  maxAmount: 0n,
  value: '',
  onChange: () => { },
  onCallback: () => { },
  error: '',
}

Source.propTypes = {
  accountAddress: PropTypes.string,
  mintAddress: PropTypes.string,
  symbol: PropTypes.string,
  maxAmount: PropTypes.any,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onCallback: PropTypes.func,
  error: PropTypes.string,
}

export default Source;