import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Row, Col, Typography, Button, Icon } from '@senswap/sen-ui'

import { updateTime } from '../controller/main.controller'

const View = () => {
  const dispatch = useDispatch()
  const { time } = useSelector((state) => state.main)

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={1}>Template</Typography.Title>
      </Col>
      <Col span={24}>
        <Typography.Text>
          Updated at: {new Date(time).toString()}
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={() => dispatch(updateTime())}
          icon={<Icon name="reload-outline" />}
          block
        >
          Update
        </Button>
      </Col>
    </Row>
  )
}

export default View
