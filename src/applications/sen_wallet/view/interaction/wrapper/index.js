import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Card } from 'sen-kit';
import Wrap from './wrap';
import Unwrap from './unwrap';


const Wrapper = ({ accountData, onChange }) => {
  const { state } = accountData;
  return <Card bordered={false}>
    <Row gutter={[16, 16]}>
      <Col span={24}>
        {!state ? <Wrap accountData={accountData} onChange={onChange} />
          : <Unwrap accountData={accountData} onChange={onChange} />}
      </Col>
    </Row>
  </Card>
}

Wrapper.defaultProps = {
  accountData: {},
  onChange: () => { },
}

Wrapper.propTypes = {
  accountData: PropTypes.object,
  onChange: PropTypes.func,
}

export default Wrapper;