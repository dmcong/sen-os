import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Typography } from 'sen-kit';

import util from 'helpers/util';

/**
 * Logo Auto Generator
 */
const AutoLogo = ({ name }) => {
  const color = util.randomColor(util.normalizeAppName(name));
  const symbol = name.substring(0, 2);
  return <Row
    style={{
      width: 64,
      height: 64,
      backgroundColor: color,
      borderRadius: 16
    }}
    justify="center"
    align="middle"
  >
    <Col>
      <Typography.Title level={1} style={{ marginBottom: 4 }}>{symbol}</Typography.Title>
    </Col>
  </Row>
}

AutoLogo.propTypes = {
  name: PropTypes.string.isRequired
}

export default AutoLogo;