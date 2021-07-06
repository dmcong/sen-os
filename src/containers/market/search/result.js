import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Typography, Button, Icon, Space } from 'sen-kit';

import metadata, { DynamicPanel } from 'helpers/loader';

const Result = ({ appName, onClick }) => {
  const { description } = metadata(appName);
  const typoMargin = { margin: '4px 8px' }
  return <Row gutter={[8, 8]}>
    <Col span={24} className="result-card" onClick={onClick}>
      <DynamicPanel appName={appName} />
      <div className="result-card-mask">
        <Row gutter={[8, 8]} align="middle" justify="center">
          <Col>
            <Space>
              <Button
                type="text"
                size="large"
                shape="circle"
                icon={<Icon name="eye-outline" />}
              />
            </Space>
          </Col>
        </Row>
      </div>
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