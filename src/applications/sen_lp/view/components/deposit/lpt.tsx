import numeral from 'numeral'

import { Row, Col, Card, Typography } from '@senswap/sen-ui'

const LPT = ({ value }: { value: string }) => {
  if (!value) return null
  return (
    <Card bordered={false}>
      <Row gutter={[8, 8]} justify="space-between" align="baseline">
        <Col span={24}>
          <Typography.Text>You will receive</Typography.Text>
        </Col>
        <Col>
          <Typography.Title type="secondary" level={5} style={{ margin: 0 }}>
            LPT
          </Typography.Title>
        </Col>
        <Col>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {numeral(value).format('0,0.[0000]')}
          </Typography.Title>
        </Col>
      </Row>
    </Card>
  )
}

export default LPT
