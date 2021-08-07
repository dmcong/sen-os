import React from 'react'
import {
  Icon,
  Typography,
  Row,
  Col,
  Button,
  Card,
  Input,
  Avatar,
  Divider,
  Select,
  Tabs,
  Space,
  Tooltip,
} from '@senswap/sen-ui'

const TYPES = [
  {
    value: 'string',
    icon: 'AB',
  },
  {
    value: 'number',
    icon: '12',
  },
  {
    value: 'object',
    icon: '{..}',
  },
]
function Header(props) {
  return (
    <Row gutter={[8, 8]} justify="end" align="middle" wrap={false}>
      <Col>
        <Button
          type="primary"
          size="small"
          icon={<Icon name="add-outline" />}
          onClick={() => props.onNew()}
        >
          New
        </Button>
      </Col>
    </Row>
  )
}

export default function NewSchema(props) {
  const { onNew, onRemove, onChange, schema } = props
  function handleChangeType(newType, colSchema) {
    colSchema.type = newType
    onChange(colSchema)
  }

  function handleChangeKey(e, colSchema) {
    colSchema.key = e.target.value
    onChange(colSchema)
  }

  return (
    <Tabs
      style={{ marginTop: -14, overflow: 'unset' }}
      tabBarExtraContent={<Header onNew={onNew}></Header>}
    >
      <Tabs.TabPane key="schema" tab="Schema">
        {schema.length ? (
          <Card bordered={false}>
            {schema.map((colSchema, idx) => {
              return (
                <Card
                  bodyStyle={{ padding: 8 }}
                  bordered={true}
                  style={{ marginBottom: idx === schema.length - 1 ? 0 : 16 }}
                  key={colSchema.id}
                >
                  <Row gutter={[0, 0]} wrap={false}>
                    <Col>
                      <Select
                        onChange={(e) => {
                          handleChangeType(e, colSchema)
                        }}
                        value={colSchema.type}
                        bordered={false}
                        suffixIcon={
                          <Divider type="vertical" style={{ margin: 0 }} />
                        }
                        size="small"
                        style={{ marginLeft: -4, marginRight: -12, width: 120 }}
                      >
                        {TYPES.map((type, i) => (
                          <Select.Option key={type.value} value={type.value}>
                            <Space style={{ lineHeight: 1 }}>
                              <Avatar src={''} size={20}>
                                {type.icon}
                              </Avatar>
                              <Typography.Text type="secondary">
                                {type.value}
                              </Typography.Text>
                            </Space>
                          </Select.Option>
                        ))}
                      </Select>
                    </Col>
                    <Col flex="auto">
                      <Tooltip
                        title={
                          <Space>
                            <Icon name="warning" />
                            {'error'}
                          </Space>
                        }
                        visible={false}
                      >
                        <Input
                          placeholder={`Key`}
                          value={colSchema.key}
                          size="small"
                          bordered={false}
                          onChange={(e) => handleChangeKey(e, colSchema)}
                          suffix={
                            <Button
                              type="text"
                              style={{ marginRight: -7 }}
                              size="small"
                              onClick={() => onRemove(colSchema.id)}
                              Icon
                              icon={<Icon name="trash-outline" />}
                            />
                          }
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                </Card>
              )
            })}
          </Card>
        ) : null}
      </Tabs.TabPane>
    </Tabs>
  )
}
