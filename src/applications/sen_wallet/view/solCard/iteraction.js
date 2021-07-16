import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ssjs from 'senswapjs';
import numeral from 'numeral';

import {
  Row, Col, Card, Avatar, Divider, Space, Icon, Typography,
  Modal, Tabs,
} from 'sen-kit';
import PriceChange from '@/sen_wallet/view/components/priceChange';
import Wrapper from '@/sen_wallet/view/interaction/wrapper';
import Transfer from './transfer';

import { getCGK } from '@/sen_wallet/controller/cgk.controller';


const Interaction = ({ visible, onClose, accountData }) => {
  const [icon, setIcon] = useState('#');
  const [price, setPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [wsolAccountAddress, setWSOLAccountAddress] = useState('');
  const dispatch = useDispatch();

  const wsolAccountData = {
    ...useSelector(state => state.accounts[wsolAccountAddress]),
    address: wsolAccountAddress,
    symbol: 'WSOL',
    name: 'Wrapped Solana',
    ticket: 'solana'
  }

  const { address, amount } = accountData;
  const balance = ssjs.undecimalize(amount, 9);
  useEffect(() => {
    (async () => {
      const { error, payload } = await dispatch(getCGK('solana'));
      if (error) return;
      const { solana: { icon, price, priceChange } } = payload;
      setIcon(icon);
      setPrice(price);
      setPriceChange(priceChange);
    })();
  }, [dispatch]);
  useEffect(() => {
    (async () => {
      const splt = window.senos.splt
      const wsolAddress = await splt.deriveAssociatedAddress(address, ssjs.DEFAULT_WSOL);
      setWSOLAccountAddress(wsolAddress);
    })();
  }, [address]);

  return <Modal
    visible={visible}
    onCancel={onClose}
    closeIcon={<Icon name="close" />}
    footer={null}
    destroyOnClose={true}
    centered={true}
  >
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row gutter={[16, 16]} align="middle" wrap={false}>
          <Col>
            <Avatar src={icon} size={40} >
              <Icon name="diamond-outline" />
            </Avatar >
          </Col>
          <Col>
            <Typography.Title level={5} style={{ margin: 0 }}>Solana</Typography.Title>
            <Typography.Text type="secondary" style={{ margin: 0 }}>SOL</Typography.Text>
          </Col>
        </Row>
      </Col>
      <Col span={24} />
      <Col span={24}>
        <Card bordered={false}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Typography.Text type="secondary" style={{ margin: 0 }}>Your Balance</Typography.Text>
            </Col>
            <Col span={24}>
              <Space size={12}>
                <Typography.Title level={3} style={{ margin: 0 }}>{numeral(balance).format('0,0.[0000]')}</Typography.Title>
                <Avatar size={20} src={icon} >
                  <Icon name="diamond-outline" />
                </Avatar>
                <Typography.Title level={3} type="secondary" style={{ margin: 0 }}>SOL</Typography.Title>
              </Space>
            </Col>
            <Col span={24}>
              <Space>
                <PriceChange value={priceChange} />
                <Divider type="vertical" />
                <Typography.Text>${price}</Typography.Text>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Tabs>
          <Tabs.TabPane key="transfer" tab="Transfer">
            <Transfer accountData={accountData} onChange={onClose} />
          </Tabs.TabPane>
          <Tabs.TabPane key="wrapper" tab="Wrapper">
            <Wrapper accountData={wsolAccountData} onChange={onClose} />
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </Row>
  </Modal>
}

export default Interaction;