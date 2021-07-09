import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import ssjs from 'senswapjs';
import numeral from 'numeral';

import { Row, Col, Card, Avatar, Icon, Typography, Divider, Space, Button } from 'sen-kit';

import { getCGK } from '@/sen_wallet/controller/cgk.controller';
import { getMint } from '@/sen_wallet/controller/mints.controller';

const FONT_SIZE = { fontSize: 11 }

const AccountCard = ({ data }) => {
  const [icon, setIcon] = useState('#');
  const [price, setPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [decimals, setDecimals] = useState(9);
  const dispatch = useDispatch();

  const { address, ticket, name, amount, symbol, mint } = data;
  useEffect(() => {
    (async () => {
      if (!ticket) return;
      const { payload: { [ticket]: { icon, price, priceChange } } } = await dispatch(getCGK(ticket));
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
      <Icon name="arrow-up-circle" />
    </Typography.Text>
    if (priceChange < 0) return <Typography.Text type="danger" style={FONT_SIZE}>
      <Icon name="arrow-down-circle" />
    </Typography.Text>
    return <Typography.Text type="warning" style={FONT_SIZE}>
      <Icon name="remove-circle" />
    </Typography.Text>
  }

  const onClick = (e) => {
    e.stopPropagation();
    console.log(address)
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
          className="btnContained"
          icon={<Icon name="send" />}
          onClick={onClick}
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
