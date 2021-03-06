import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Typography, Button, Icon } from 'sen-kit';

import metadata, { DynamicPanel } from 'helpers/loader';

const AppPanelInMarket = ({ appName, onClick }) => {
  const { description } = metadata(appName);
  const typoMargin = { margin: '4px 8px' }
  return <Row gutter={[8, 8]}>
    <Col span={24} className="result-card" onClick={onClick}>
      <DynamicPanel appName={appName} />
      <div className="result-card-mask">
        <Row gutter={[8, 8]} align="middle" justify="center">
          <Col>
            <Button
              type="text"
              size="large"
              shape="circle"
              icon={<Icon name="eye-outline" />}
              onClick={onClick}
            />
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

AppPanelInMarket.defaultProps = {
  onClick: () => { },
}

AppPanelInMarket.propTypes = {
  appName: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

export default AppPanelInMarket;