import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { getMint } from '@/sen_wallet/controller/mints.controller';
import ssjs from 'senswapjs';
import numeral from 'numeral';

import { Row, Col, Input, Typography, Button, Space, Tooltip, Icon } from 'sen-kit';

import util from 'helpers/util';


const Source = ({
  accountAddress, mintAddress, symbol, maxAmount,
  value, onChange, error
}) => {
  const [decimals, setDecimals] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { error, payload } = await dispatch(getMint(mintAddress));
      if (error) return;
      const { [mintAddress]: { decimals } } = payload;
      return setDecimals(decimals);
    })();
  }, [mintAddress, dispatch]);

  const balance = ssjs.undecimalize(maxAmount, decimals);
  const max = () => onChange(balance);

  return <Row gutter={[8, 8]}>
    <Col span={24}>
      <Typography.Text>Amount</Typography.Text>
    </Col>
    <Col span={24}>
      <Input
        placeholder={0}
        prefix={<Tooltip title={`Your token account: ${accountAddress}`}>
          <Button
            type="link"
            style={{ marginLeft: -7, color: '#ffffff73' }}
            icon={<Icon name="wallet-outline" />}
            href={util.explorer(accountAddress)}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!ssjs.isAddress(accountAddress)}
          >{symbol}</Button>
        </Tooltip>}
        suffix={<Button
          type="text"
          style={{ marginRight: -7 }}
          onClick={max}
        >MAX</Button>}
        value={value}
        onChange={e => onChange(e.target.value || '')}
      />
    </Col>
    <Col span={24}>
      <Row gutter={[8, 8]} align="center" justify="space-between" wrap={false}>
        <Col>
          {error ? <Typography.Text type="danger" style={{ fontSize: 11 }}>
            <Space>
              <Icon name="warning-outline" />
              {error}
            </Space>
          </Typography.Text> : null}
        </Col>
        <Col>
          <Space>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>Available: </Typography.Text>
            <Tooltip title={balance}>
              <Typography.Text style={{ fontSize: 11 }}>{numeral(balance).format('0,0.[0000]')}</Typography.Text>
            </Tooltip>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>{symbol}</Typography.Text>
          </Space>
        </Col>
      </Row>
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
  error: '',
}

Source.propTypes = {
  accountAddress: PropTypes.string,
  mintAddress: PropTypes.string,
  symbol: PropTypes.string,
  maxAmount: PropTypes.any,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
}

export default Source;