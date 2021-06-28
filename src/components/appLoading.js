import React, { Component } from 'react';
import { Row, Col, Spin, Widget } from 'sen-kit';

/**
 * Lazy Loading
 */
class AppLoading extends Component {
  render() {
    return <Widget type="glass">
      <Row gutter={[16, 16]} justify="center" >
        <Col span={24} style={{ height: 160 }} />
        <Col>
          <Spin size="large" />
        </Col>
      </Row>
    </Widget>
  }
}
export default AppLoading;