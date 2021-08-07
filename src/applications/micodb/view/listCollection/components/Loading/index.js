import React from 'react'
import { Row, Col, Spin } from '@senswap/sen-ui'

export default function AppLoading() {
  return (
    <Row
      gutter={[8, 8]}
      style={{ height: '100%' }}
      align="middle"
      justify="center"
    >
      <Col>
        <Spin size="large" />
      </Col>
    </Row>
  )
}
