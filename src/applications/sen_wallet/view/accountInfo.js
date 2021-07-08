import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ssjs from 'senswapjs';
import numeral from 'numeral';

import { Row, Col, Avatar, Typography, Tooltip, Space, Icon, Button, Popover } from 'sen-kit';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';

import { useSenOs } from 'helpers/senos';
import util from 'helpers/util';
import mintConfig from '@/sen_wallet/config/mint.config';
import { getCGK } from '@/sen_wallet/controller/cgk.controller';

const shortenAddress = (address, size = 6) => {
  const prefix = address.substring(0, size);
  const suffix = address.substring(address.length - size, address.length);
  return prefix + '...' + suffix;
}

const Copy = ({ address }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await setCopied(true);
    await util.asyncWait(1500);
    await setCopied(false);
  }
  if (!ssjs.isAddress(address)) return null;
  return <Tooltip title="Copied" visible={copied}>
    <CopyToClipboard text={address} onCopy={onCopy} >
      <Button
        type="text"
        size="small"
        icon={<Icon name="copy-outline" />}
      />
    </CopyToClipboard>
  </Tooltip>
}

const QR = ({ address }) => {
  return <Popover
    overlayInnerStyle={{ paddingTop: 6 }}
    content={<QRCode value={address} size={140} bgColor="#1f1f1f" fgColor="#ffffff" />}
    trigger="click"
  >
    <Button
      type="text"
      size="small"
      icon={<Icon name="qr-code-outline" />}
    />
  </Popover>
}


const getTotalBalance = async (accounts, bucket, getPrice) => {
  let usd = 0;
  const mintAddresses = mintConfig.map(({ address }) => address);
  for (let accountAddress of accounts) {
    const { mint: mintAddress, amount } = bucket[accountAddress] || {};
    const index = mintAddresses.indexOf(mintAddress);
    if (index < 0) continue;
    const { ticket, decimals } = mintConfig[index];
    const { payload: { [ticket]: { price } } } = await getPrice(ticket);
    usd = usd + ssjs.undecimalize(amount, decimals) * price;
  }
  return usd;
}

const AccountInfo = () => {
  const [value, setValue] = useState(0);
  const bucket = useSelector(state => state.bucket);
  const { accounts } = useSelector(state => state.main);
  const dispatch = useDispatch();
  const { senos: { wallet: { address, lamports } } } = useSenOs();

  const balance = ssjs.undecimalize(lamports, 9);
  useEffect(() => {
    (async () => {
      const getPrice = (ticket) => dispatch(getCGK(ticket));
      const usd = await getTotalBalance(accounts, bucket, getPrice);
      setValue(usd);
    })();
  }, [accounts, bucket, dispatch]);

  return <Row gutter={[16, 16]}>
    <Col span={24}>
      <Row gutter={[16, 16]} wrap={false} align="middle">
        <Col>
          <Avatar size={48}>{ssjs.randEmoji(address)}</Avatar>
        </Col>
        <Col flex="auto">
          <Row>
            <Col span={24}>
              <Row wrap={false}>
                <Col flex="auto">
                  <Tooltip title={address}>
                    <Typography.Text>{shortenAddress(address)}</Typography.Text>
                  </Tooltip>
                </Col>
                <Col>
                  <Space>
                    <Copy address={address} />
                    <QR address={address} />
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Tooltip title={balance}>
                <Typography.Text type="secondary">{numeral(balance).format('0.[0000]')} SOL</Typography.Text>
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
    <Col sapn={24}>
      <Typography.Title level={2}>$ {numeral(value).format('0,0.[00]')}</Typography.Title>
    </Col>
  </Row>
}

export default AccountInfo;