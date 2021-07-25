import { Card, Row, Col, Typography } from '@senswap/sen-ui'
import { DynamicLogo } from 'helpers/loader'

const Intro = ({
  type,
  description,
  preset = [],
  selected = false,
  onClick = () => {},
}: {
  type: string
  description: string
  preset: string[]
  selected: boolean
  onClick: () => void
}) => {
  return (
    <Row gutter={[16, 16]} onClick={onClick}>
      <Col span={24}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {type}
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
          {description}
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Card bordered={selected} bodyStyle={{ padding: 16 }} hoverable>
          <Row gutter={[16, 16]} onClick={onClick}>
            <Col span={24}>
              <Row gutter={[16, 8]}>
                {preset.map((appName) => (
                  <Col key={appName}>
                    <DynamicLogo name={appName} />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default Intro
