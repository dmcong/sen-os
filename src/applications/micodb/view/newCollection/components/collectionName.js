import React from 'react'
import { Typography, Row, Col, Button, Card, Input } from '@senswap/sen-ui'

export default function CollectionName(props) {
  const { value, onChange } = props
  return (
    <Card bordered={false}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Paragraph type="secondary">
            <strong style={{ color: 'white' }}>
              Collection Name is required.
            </strong>{' '}
            The name that you type does not exceed 31 characters, not contain
            any of the following characters: : \ / ? * [ or ]
          </Typography.Paragraph>
        </Col>
        <Col span={24}>
          <Input
            placeholder={'Collection name'}
            suffix={
              <Button type="text" shape="circle" style={{ marginRight: -7 }} />
            }
            value={value}
            onChange={onChange}
          />
        </Col>
      </Row>
    </Card>
  )
}
