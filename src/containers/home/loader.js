import React, { Component, Suspense, lazy } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { Row, Col, Spin, Widget } from 'sen-kit';

import util from 'helpers/util';

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
    const folderName = util.normalizeAppName(appName);
    const Application = lazy(async () => {
      try {
        return await import(`applications/${folderName}`);
      } catch (er) {
        return await import('./guard');
      }
    });
    return <Suspense key={nanoid()} fallback={<Loading />}>
      <Application appName={appName} />
    </Suspense>
  } catch (er) {
    return
  }
}

export { load }