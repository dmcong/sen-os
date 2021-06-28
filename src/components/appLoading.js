import React from 'react';
import { Row, Col, Spin, Widget } from 'sen-kit';

/**
 * Lazy Loading
 */
const AppLoading = () => {
  return <Widget type="glass">
    <Row gutter={[16, 16]} justify="center" >
      <Col span={24} style={{ height: 160 }} />
      <Col>
        <Spin size="large" />
      </Col>
    </Row>
  </Widget>
}

export default AppLoading;