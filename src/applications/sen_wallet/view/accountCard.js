import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import ssjs from 'senswapjs';
import numeral from 'numeral';

import { Row, Col, Card, Avatar, Icon, Typography, Divider, Space, Button } from 'sen-kit';

import { getCGK } from '@/sen_wallet/controller/cgk.controller';
import { getMint } from '@/sen_wallet/controller/mints.controller';

const FONT_SIZE = { fontSize: 11 }

const AccountCard = ({ data, onClick }) => {
  const [icon, setIcon] = useState('#');
  const [price, setPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [decimals, setDecimals] = useState(9);
  const dispatch = useDispatch();

  const { ticket, name, amount, symbol, mint } = data;
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
  const balance = ssjs.undecimalize(amount, decimals);

  const arrow = () => {
    if (priceChange > 0) return <Typography.Text type="success" style={FONT_SIZE}>
      <Icon name="arrow-up-circle" /> {numeral(Math.abs(priceChange)).format('0.[0]')}%
    </Typography.Text>
    if (priceChange < 0) return <Typography.Text type="danger" style={FONT_SIZE}>
      <Icon name="arrow-down-circle" /> {numeral(Math.abs(priceChange)).format('0.[0]')}%
    </Typography.Text>
    return <Typography.Text type="warning" style={FONT_SIZE}>
      <Icon name="remove-circle" /> {numeral(Math.abs(priceChange)).format('0.[0]')}%
    </Typography.Text>
  }

  const onSend = (e) => {
    e.stopPropagation();
    return onClick();
  }

  return <Card bodyStyle={{ padding: 16 }} bordered={false} hoverable >
    <Row gutter={[16, 16]} align="middle" wrap={false}>
      <Col>
        <Avatar src={icon} size={32} >
          <Icon name="diamond-outline" />
        </Avatar >
      </Col>
      <Col flex="auto">
        <Space direction="vertical" size={0}>
          <Space>
            <Typography.Text>{numeral(balance).format('0,0.[00]')} </Typography.Text>
            <Typography.Text type="secondary">{symbol || 'TOKEN'}</Typography.Text>
          </Space>
          <Space>
            <Typography.Text style={FONT_SIZE}>{name || mint.substring(0, 6)}</Typography.Text>
            <Divider type="vertical" style={{ margin: 0 }} />
            {arrow()}
            <Typography.Text style={FONT_SIZE}>${price}</Typography.Text>
          </Space>
        </Space>
      </Col>
      <Col>
        <Button
          type="text"
          className="contained"
          icon={<Icon name="send" />}
          onClick={onSend}
        />
      </Col>
    </Row>
  </Card>
}

AccountCard.defaultProps = {
  onClick: () => { }
}

AccountCard.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
}

export default AccountCard;
