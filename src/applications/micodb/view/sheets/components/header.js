import React from 'react'
import { Row, Col, Divider, Icon, Button, Typography } from '@senswap/sen-ui'
import { useDispatch } from 'react-redux'
import { disconnectDatabase } from '@/micodb/controller/main.controller'

export default function Header() {
  const dispatch = useDispatch()
  return (
    <Row gutter={[8, 8]} justify="end" align="middle" wrap={false}>
      <Col>
        <Button type="primary" size="small" icon={<Icon name="add-outline" />}>
          Table
        </Button>
      </Col>

      <Col>
        <Divider type="vertical" style={{ margin: 0, padding: 0 }} />
        <Button
          type="text"
          shape="circle"
          size="small"
          icon={<Icon name="power" />}
          onClick={() => dispatch(disconnectDatabase())}
        />
      </Col>
    </Row>
  )
}
