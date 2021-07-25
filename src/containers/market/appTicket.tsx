import { Row, Col, Card, Button, Typography } from '@senswap/sen-ui'
import metadata, { DynamicLogo } from 'helpers/loader'

const AppTicket = ({
  appName,
  installed = false,
  onClick = () => {},
  onAdd = () => {},
}: {
  appName: string
  installed?: boolean
  onClick?: () => void
  onAdd?: () => void
}) => {
  const { description } = metadata(appName)
  return (
    <Card
      className="shadowed"
      style={{ backgroundColor: '#181C36' }}
      bordered={false}
    >
      <Row gutter={[16, 16]} wrap={false}>
        <Col>
          <DynamicLogo name={appName} title={false} onClick={onClick} />
        </Col>
        <Col flex="auto">
          <Typography.Title level={5} style={{ margin: 0 }}>
            {appName}
          </Typography.Title>
          <Typography.Text type="secondary">{description}</Typography.Text>
        </Col>
        <Col>
          {installed ? (
            <Button
              type="text"
              shape="round"
              className="contained"
              onClick={onClick}
            >
              View
            </Button>
          ) : (
            <Button
              type="text"
              shape="round"
              className="contained"
              onClick={onAdd}
            >
              Add
            </Button>
          )}
        </Col>
      </Row>
    </Card>
  )
}

export default AppTicket
