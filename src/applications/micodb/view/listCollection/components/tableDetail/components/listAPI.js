import React from 'react'
import { useSelector } from 'react-redux'
import {
  Row,
  Col,
  Input,
  Card,
  Button,
  Typography,
  Divider,
} from '@senswap/sen-ui'

function ApiViewer(props) {
  const { api } = props

  function getColorMethod(method) {
    const defaultColor = {
      POST: '#3DBA4E',
      GET: '#1B98E0',
      DELETE: '#F9575E',
      PUT: '#ffe1a8',
    }
    return defaultColor[method]
  }
  return (
    <Card
      bodyStyle={{ padding: 8 }}
      bordered={true}
      style={{ marginBottom: 16 }}
    >
      <Row gutter={[0, 0]} wrap={false}>
        <Col flex="auto">
          <Input
            value={api.url}
            size="small"
            bordered={false}
            prefix={
              <React.Fragment>
                <Button
                  type="text"
                  style={{
                    color: getColorMethod(api.method),
                    width: 60,
                    textAlign: 'left',
                  }}
                  size="small"
                  onClick={() => {}}
                >
                  {api.method}
                </Button>
                <Divider type="vertical" style={{ marginRight: 12 }} />
              </React.Fragment>
            }
            suffix={
              <Typography.Text type="secondary">{api.title}</Typography.Text>
            }
          />
        </Col>
      </Row>
    </Card>
  )
}

export default function ListAPI(props) {
  const { collectionName } = props
  const listAPI = useSelector(
    (state) => state.collection[collectionName].listAPI,
  )
  return (
    <React.Fragment>
      <Col span={24}>
        <Typography.Paragraph type="secondary">
          <strong style={{ color: 'white' }}>Base API:</strong>{' '}
          http://heroku.xzy.com/micodb/6512783123123909213981231231236718231239
        </Typography.Paragraph>
      </Col>
      {listAPI.map((api) => (
        <ApiViewer api={api}></ApiViewer>
      ))}
    </React.Fragment>
  )
}
