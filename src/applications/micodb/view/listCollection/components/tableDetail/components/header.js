import React from 'react'
import { Row, Col, Avatar, Typography } from '@senswap/sen-ui'

export default function Header(props) {
  const { name } = props
  return (
    <Row gutter={[16, 16]} align="middle" wrap={false}>
      <Col>
        <Avatar size={40} style={{ backgroundColor: '#F9575E' }}>
          {name.substring(0, 2).toUpperCase()}
        </Avatar>
      </Col>
      <Col>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {name}
        </Typography.Title>
        <Typography.Text type="secondary" style={{ margin: 0 }}>
          Collection
        </Typography.Text>
      </Col>
    </Row>
  )
}
