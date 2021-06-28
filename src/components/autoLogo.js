import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Typography } from 'sen-kit';

import util from 'helpers/util';

/**
 * Logo Auto Generator
 */
const AutoLogo = ({ name }) => {
  const bgColor = util.randomColor(util.normalizeAppName(name), 'light');
  const symbol = name.substring(0, 2);
  const txtColor = util.randomColor(symbol, 'dark', bgColor);
  return <Row
    style={{
      width: 64,
      height: 64,
      backgroundColor: bgColor,
      borderRadius: 16
    }}
    justify="center"
    align="middle"
  >
    <Col>
      <Typography.Title
        level={1}
        style={{ marginBottom: 4, color: txtColor, }}
      >{symbol}</Typography.Title>
    </Col>
  </Row>
}

AutoLogo.propTypes = {
  name: PropTypes.string.isRequired
}

export default AutoLogo;