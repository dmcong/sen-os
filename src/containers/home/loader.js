import React, { Component, Suspense, lazy } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { Row, Col, Spin, Widget, Typography, Button, Icon } from 'sen-kit';

/**
 * Removed Application
 */
const RemovedApplication = ({ appName }) => {
  const remove = () => {
    // Not yet
  }
  return <Widget type="glass">
    <Row gutter={[16, 16]} >
      <Col span={24} style={{ height: 80 }} />
      <Col span={24}>
        <Typography.Title level={3} align="center">{appName}</Typography.Title>
      </Col>
      <Col span={24}>
        <Typography.Title level={5} align="center">Oops! The application had been removed from the market</Typography.Title>
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]} justify="center" align="middle" >
          <Col>
            <Button
              type="primary"
              icon={<Icon name="trash-outline" />}
              onClick={remove}
            >Remove</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  </Widget>
}

/**
 * Lazy Loading
 */
class Loading extends Component {
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

/**
 * App Loader
 */
const load = (appName) => {
  try {
    const folderName = appName.replace(' ', '_').toLowerCase();
    const Application = lazy(() => import(`containers/market/${folderName}`));
    return <Suspense key={nanoid()} fallback={<Loading />}>
      <Application />
    </Suspense>
  } catch (er) {
    return <RemovedApplication appName={appName} />
  }
}

export { load }