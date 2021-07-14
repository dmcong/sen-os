import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Card } from 'sen-kit';
import Wrap from './wrap';
import Unwrap from './unwrap';


const Wrapper = ({ accountData, reset, onChange }) => {
  const { state } = accountData;
  return <Card bordered={false}>
    <Row gutter={[16, 16]}>
      <Col span={24}>
        {!state ? <Wrap
          accountData={accountData}
          reset={reset}
          onChange={onChange}
        /> : <Unwrap
          accountData={accountData}
          reset={reset}
          onChange={onChange}
        />}
      </Col>
    </Row>
  </Card>
}

Wrapper.defaultProps = {
  reset: false,
  accountData: {},
  onChange: () => { },
}

Wrapper.propTypes = {
  reset: PropTypes.bool,
  accountData: PropTypes.object,
  onChange: PropTypes.func,
}

export default Wrapper;