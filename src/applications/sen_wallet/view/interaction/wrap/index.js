import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Button, Card } from 'sen-kit';


const Wrap = ({ accountData, reset, onChange }) => {

  return <Card bordered={false}>
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Button
          type="primary"
          block
        >Wrap</Button>
      </Col>
      <Col span={12}>
        <Button
          type="text"
          className="contained"
          block
        >Unwrap</Button>
      </Col>
    </Row>
  </Card>
}

Wrap.defaultProps = {
  reset: false,
  accountData: {},
  onChange: () => { },
}

Wrap.propTypes = {
  reset: PropTypes.bool,
  accountData: PropTypes.object,
  onChange: PropTypes.func,
}

export default Wrap;