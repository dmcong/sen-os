import { Row, Col, Typography, Icon, Switch } from '@senswap/sen-ui'

const Advanced = ({
  value,
  onChange,
}: {
  value: boolean
  onChange: (value: boolean) => void
}) => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Row gutter={[8, 8]} wrap={false}>
          <Col flex="auto">
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              Advanced Mode
            </Typography.Text>
          </Col>
          <Col>
            <Switch
              size="small"
              checkedChildren={<Icon name="calculator-outline" />}
              unCheckedChildren={<Icon name="sparkles-outline" />}
              checked={value}
              onChange={onChange}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Advanced
