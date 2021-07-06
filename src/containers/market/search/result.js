import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Typography } from 'sen-kit';

import metadata, { DynamicPanel } from 'helpers/loader';

const Result = ({ appName, onClick }) => {
  const { description } = metadata(appName);
  const typoMargin = { margin: '4px 8px' }
  return <Row gutter={[8, 8]} style={{ cursor: 'pointer' }} onClick={onClick}>
    <Col span={24}>
      <DynamicPanel appName={appName} />
    </Col>
    <Col span={24}>
      <Typography.Title level={5} style={typoMargin}>{appName}</Typography.Title>
      <Typography.Text type="secondary" style={typoMargin}>{description}</Typography.Text>
    </Col>
  </Row>
}

Result.defaultProps = {
  onClick: () => { },
}

Result.propTypes = {
  appName: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

export default Result;