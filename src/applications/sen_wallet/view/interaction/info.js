import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import ssjs from 'senswapjs';
import numeral from 'numeral';

import { Row, Col, Card, Typography, Icon, Space, Divider, Avatar } from 'sen-kit';

import { getCGK } from '@/sen_wallet/controller/cgk.controller';
import { getMint } from '@/sen_wallet/controller/mints.controller';


const Info = ({ accountData, reset }) => {
  const [icon, setIcon] = useState('#');
  const [price, setPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [decimals, setDecimals] = useState(0);
  const dispatch = useDispatch();

  const { mint, amount, ticket, symbol } = accountData;
  const balance = ssjs.undecimalize(amount, decimals);
  useEffect(() => {
    (async () => {
      const { error, payload } = await dispatch(getCGK(ticket));
      if (error) return;
      const { [ticket]: { icon, price, priceChange } } = payload;
      const { payload: { [mint]: { decimals } } } = await dispatch(getMint(mint));
      setIcon(icon);
      setPrice(price);
      setPriceChange(priceChange);
      setDecimals(decimals);
    })();
  }, [ticket, dispatch, mint]);
  useEffect(() => {
    return () => {
      setIcon('#');
      setPrice(0);
      setPriceChange(0);
      setDecimals(0);
    }
  }, [reset]);

  const arrow = () => {
    if (priceChange > 0) return <Typography.Text type="success">
      <Icon name="arrow-up-circle" />
    </Typography.Text>
    if (priceChange < 0) return <Typography.Text type="danger">
      <Icon name="arrow-down-circle" />
    </Typography.Text>
    return <Typography.Text type="warning">
      <Icon name="remove-circle" />
    </Typography.Text>
  }

  const percentage = () => {
    if (priceChange > 0) return <Typography.Text type="success">
      {numeral(Math.abs(priceChange)).format('0.[0]')}%
    </Typography.Text>
    if (priceChange < 0) return <Typography.Text type="danger">
      {numeral(Math.abs(priceChange)).format('0.[0]')}%
    </Typography.Text>
    return <Typography.Text type="warning">
      {numeral(Math.abs(priceChange)).format('0.[0]')}%
    </Typography.Text>
  }

  return <Card bordered={false}>
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Text type="secondary" style={{ margin: 0 }}>Your Balance</Typography.Text>
      </Col>
      <Col span={24}>
        <Space>
          <Typography.Title level={3} style={{ margin: 0 }}>{numeral(balance).format('0,0.[0000]')}</Typography.Title>
          <Avatar size={20} src={icon} >
            <Icon name="diamond-outline" />
          </Avatar>
          <Typography.Title level={3} type="secondary" style={{ margin: 0 }}>{symbol || 'TOKEN'}</Typography.Title>
        </Space>
      </Col>
      <Col span={24}>
        <Space>
          {arrow()}
          {percentage()}
          <Divider type="vertical" />
          <Typography.Text>${price}</Typography.Text>
        </Space>
      </Col>
    </Row>
  </Card>
}

Info.defaultProps = {
  reset: false,
  accountData: {},
}

Info.propTypes = {
  reset: PropTypes.bool,
  accountData: PropTypes.object,
}

export default Info;