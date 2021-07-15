import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col, Button, Typography, Card } from 'sen-kit';
import ReactJson from 'react-json-view';

import PDB from 'helpers/pdb';


const Policy = ({ value, onChange }) => {
  const [data, setData] = useState({});
  const { address } = useSelector(state => state.wallet);

  useEffect(() => {
    (async () => {
      if (!value) return setData({});
      const pdb = new PDB(address);
      const d = await pdb._getAll();
      return setData(d);
    })();
  }, [value, address]);

  const store = <Row gutter={[16, 16]}>
    <Col span={24}>
      <ReactJson
        src={data}
        theme="flat"
        style={{ background: 'transparent', fontSize: 12 }}
        iconStyle="circle"
        displayDataTypes={false}
        displayObjectSize={false}
        enableClipboard={false}
        indentWidth={2}
      />
    </Col>
  </Row>

  const policy = <Row gutter={[16, 16]}>
    <Col span={24}>
      <Typography.Title level={5}>Why should I backup?</Typography.Title>
      <ul style={{ paddingLeft: 16 }}>
        <li>
          <Typography.Text type="secondary">Because we never keep your data.</Typography.Text>
        </li>
        <li>
          <Typography.Text type="secondary">You can migrate data in the device machine to a new one.</Typography.Text>
        </li>
        <li>
          <Typography.Text type="secondary">Restore data in case your device is broken and lost all data.</Typography.Text>
        </li>
      </ul>
    </Col>
    <Col span={24}>
      <Typography.Title level={5}>What is IPFS?</Typography.Title>
      <ul style={{ paddingLeft: 16 }}>
        <li>
          <Typography.Text type="secondary">IPFS is a decentralized database. Everyone can publicly access data on it even your stored data.</Typography.Text>
        </li>
        <li>
          <Typography.Text type="secondary">Make sure that no sensitive data is in the store.</Typography.Text>
        </li>
      </ul>
    </Col>
    <Col span={24}>
      <Button onClick={() => onChange(true)} block>Click here to review the data first</Button>
    </Col>
  </Row>

  return <Card bordered={false} bodyStyle={{ maxHeight: 336, overflow: 'scroll' }}>
    {value ? store : policy}
  </Card>
}

Policy.defaultProps = {
  value: false,
  onChange: () => { }
}

Policy.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
}

export default Policy;