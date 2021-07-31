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
              Advance Mode
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
      <Col span={24}>
        <Typography.Paragraph style={{ fontSize: 11, textAlign: 'justify' }}>
          <Icon name="warning-outline" /> This advance mode will disable the
          automatic optimization that often results in bad rates and lost funds.
          Only use this mode if you know what you are doing.{' '}
          <strong style={{ color: '#f9575e' }}>
            The advance mode will display in the tokenlist.
          </strong>
        </Typography.Paragraph>
      </Col>
    </Row>
  )
}

export default Advanced
