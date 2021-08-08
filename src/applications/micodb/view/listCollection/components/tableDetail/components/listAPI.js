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
import { API_URL } from '@/micodb/config/config'
import Postman from './postman'

function ApiViewer(props) {
  const { api, collection } = props

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
    <Row gutter={[16, 12]} align="middle">
      <Col flex="auto">
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
                  <Typography.Text type="secondary">
                    {api.title}
                  </Typography.Text>
                }
              />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col style={{ marginBottom: 16 }}>
        <Postman api={api} collection={collection}></Postman>
      </Col>
    </Row>
  )
}

export default function ListAPI(props) {
  const { collectionName } = props
  const listAPI = useSelector(
    (state) => state.collection[collectionName].listAPI,
  )
  const deployID = useSelector((state) => state.main.deployID)
  return (
    <React.Fragment>
      <Col span={24}>
        <Typography.Paragraph type="secondary">
          <strong style={{ color: 'white' }}>Base API:</strong>{' '}
          {`${API_URL}/micodb/${deployID}/`}
        </Typography.Paragraph>
      </Col>
      {listAPI.map((api) => (
        <ApiViewer api={api} collection={collectionName}></ApiViewer>
      ))}
    </React.Fragment>
  )
}
