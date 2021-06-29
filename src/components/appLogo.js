import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Typography } from 'sen-kit';

import util from 'helpers/util';


/**
 * Application Logo
 */
const AppLogo = ({ name, src, title, ...others }) => {
  // Infer color
  const bgColor = util.randomColor(util.normalizeAppName(name), 'light');
  const symbol = name.substring(0, 2);
  const txtColor = util.randomColor(symbol, 'dark', bgColor);
  // Build background
  const bg = src ? {
    backgroundImage: `url("${src}")`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  } : { backgroundColor: bgColor }
  // Render
  return <Row
    style={{ width: 64, cursor: 'pointer' }}
    gutter={[0, 8]}
    {...others}
  >
    <Col span={24}>
      <Row
        style={{ height: 64, borderRadius: 16, ...bg }}
        justify="center"
        align="middle"
      >
        {src ? null : <Col>
          <Typography.Title
            level={1}
            style={{ marginBottom: 4, color: txtColor }}
          >{symbol}</Typography.Title>
        </Col>}
      </Row>
    </Col>
    {title ? <Col span={24}>
      <p align="center" style={{ fontSize: 10, margin: 0 }}>{name}</p>
    </Col> : null}
  </Row>
}

AppLogo.defaultProps = {
  title: true,
}

AppLogo.propTypes = {
  title: PropTypes.bool,
  src: PropTypes.string,
  name: PropTypes.string.isRequired
}

export default AppLogo;