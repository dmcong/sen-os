import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ssjs from 'senswapjs';

import { Row, Col, Input, Typography, Button, Tooltip, Icon, Space } from 'sen-kit';


const Destination = ({ mintAddress, value, onChange, error }) => {
  const [address, setAddress] = useState('');
  const [created, setCreated] = useState(false);

  useEffect(() => {
    (async () => {
      if (!ssjs.isAddress(value)) return setCreated(false);
      try {
        const splt = window.senos.splt;
        const associatedAddress = await splt.deriveAssociatedAddress(value, mintAddress);
        await setAddress(associatedAddress);
        const { state } = await splt.getAccountData(associatedAddress);
        if (!state) return setCreated(false);
        return setCreated(true);
      } catch (er) {
        return setCreated(false);
      }
    })();
  }, [value, mintAddress]);

  const icon = () => {
    if (!ssjs.isAddress(value)) return <Tooltip title="Invalid address">
      <Icon name='warning-outline' style={{ color: '#F2323F' }} />
    </Tooltip>
    if (!created) return <Tooltip title="The receiver account is not created. You may pay little fee to create it for the receiver.">
      <Icon name='help-circle-outline' style={{ color: '#FCB017' }} />
    </Tooltip>
    return <Tooltip title={`The account is safe to transfer. The receiver associated address is ${address}.`}>
      <Icon name='shield-checkmark-outline' style={{ color: '#3DBA4E' }} />
    </Tooltip>
  }

  return <Row gutter={[8, 8]}>
    <Col span={24}>
      <Typography.Text>Receiver Address</Typography.Text>
    </Col>
    <Col span={24}>
      <Input
        placeholder={mintAddress.substring(0, 6) + '...'}
        suffix={<Button
          type="text"
          shape="circle"
          style={{ marginRight: -7 }}
          icon={icon()}
        />}
        value={value}
        onChange={e => onChange(e.target.value || '')}
      />
    </Col>
    <Col span={24}>
      {error ? <Typography.Text type="danger" style={{ fontSize: 11 }}><Space>
        <Icon name="warning-outline" />
        {error}
      </Space>
      </Typography.Text> : null}
    </Col>
  </Row>
}

Destination.defaultProps = {
  accountAddress: '',
  mintAddress: '',
  value: '',
  onChange: () => { },
  error: '',
}

Destination.propTypes = {
  accountAddress: PropTypes.string,
  mintAddress: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.any,
  error: PropTypes.string,
}

export default Destination;