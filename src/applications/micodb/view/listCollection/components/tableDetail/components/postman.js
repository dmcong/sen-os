import React, { useEffect, useState } from 'react'

import {
  Row,
  Col,
  Button,
  Popover,
  Typography,
  Icon,
  Input,
  Divider,
} from '@senswap/sen-ui'
import JsonViewer from '@/micodb/components/JsonViewer'
import { useSelector } from 'react-redux'
import { API_URL } from '@/micodb/config/config'
import axios from 'axios'

export default function Postman(props) {
  const { collection, api } = props
  const [apiTest, setApiTest] = useState({})
  const [response, setResponse] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const collectionConfig = useSelector((state) => state.collection[collection])
  const mainConfig = useSelector((state) => state.main)

  function buildBodyFromSchema(schema) {
    const body = {}
    for (const key in schema) {
      const type = schema[key]
      switch (type) {
        case 'string':
          body[key] = 'AutoString'
          break
        case 'number':
          body[key] = Math.random()
          break
        case 'object':
          body[key] = ['1', 2, [], {}]
          break
        default:
          break
      }
    }
    return body
  }
  useEffect(() => {
    const schema = collectionConfig.schema
    const autoBody = buildBodyFromSchema(schema)
    let body = {}
    if (['POST', 'PUT'].includes(api.method)) {
      body = autoBody
    }
    const url = `${API_URL}/micodb/${mainConfig.deployID}${api.url}`.replace(
      ':id',
      '5',
    )
    setApiTest({
      body,
      url,
    })
  }, [api, collectionConfig, mainConfig])

  async function fetchAPI() {
    setIsLoading(true)
    const response = await axios({
      method: api.method,
      url: apiTest.url,
      data: apiTest.body,
      headers: {},
    }).then((data) => data.data)
    setResponse(response)
    setIsLoading(false)
  }
  return (
    <Popover
      overlayInnerStyle={{ width: 600 }}
      content={
        <React.Fragment>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Typography.Title level={5}>Quick Test API </Typography.Title>
            </Col>
          </Row>
          <Row gutter={[8, 8]} style={{ overflow: 'auto', maxHeight: '80vh' }}>
            {/* URL */}
            <Col span={24}>
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                URL:
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Row gutter={[8, 4]} align="middle">
                <Col flex="auto">
                  <Input
                    value={apiTest.url}
                    onChange={(e) => {
                      setApiTest({ ...apiTest, url: e.target.value })
                    }}
                    prefix={
                      <React.Fragment>
                        <Typography.Text type="secondary">
                          {api.method}
                        </Typography.Text>
                        <Divider type="vertical" style={{ marginRight: 12 }} />
                      </React.Fragment>
                    }
                  />
                </Col>
                <Col>
                  <Button
                    type="primary"
                    size="small"
                    icon={<Icon name="send" />}
                    onClick={() => fetchAPI()}
                    loading={isLoading}
                  ></Button>
                </Col>
              </Row>
            </Col>

            {/* Body */}
            <Col span={24}>
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                Body:
              </Typography.Text>
            </Col>
            <Col span={24}>
              <JsonViewer jsonData={apiTest.body}></JsonViewer>
            </Col>
            <Divider style={{ marginTop: 8, marginBottom: 8 }} />
            {/* Response */}
            <Col span={24}>
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                Response:
              </Typography.Text>
            </Col>
            <Col span={24}>
              <JsonViewer jsonData={response}></JsonViewer>
            </Col>
          </Row>
        </React.Fragment>
      }
      trigger="click"
    >
      <Button
        type="text"
        shape="circle"
        size="small"
        icon={<Icon name="settings-outline" />}
      />
    </Popover>
  )
}
