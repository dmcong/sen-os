import numeral from 'numeral'

import { Row, Col, Card, Button, Icon, Typography } from '@senswap/sen-ui'

const LPT = ({ value }: { value: string }) => {
  if (!value) return null
  return (
    <Row gutter={[8, 8]} justify="center">
      <Col>
        <Button
          type="text"
          className="contained"
          icon={<Icon name="arrow-down-outline" />}
        />
      </Col>
      <Col span={24}>
        <Card bordered={false}>
          <Row gutter={[8, 8]} justify="space-between" align="baseline">
            <Col span={24}>
              <Typography.Text>You will receive</Typography.Text>
            </Col>
            <Col>
              <Typography.Title
                type="secondary"
                level={5}
                style={{ margin: 0 }}
              >
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
      </Col>
    </Row>
  )
}

export default LPT
