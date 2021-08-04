import { useState } from 'react'
import {
  Card,
  Icon,
  Input,
  Button,
  Row,
  Col,
  Typography,
} from '@senswap/sen-ui'

import { SenTradeMark } from 'components/trademark'
import { useDispatch } from 'react-redux'
import { connectDatabase } from '@/micodb/controller/main.controller'

const Login = () => {
  const [deployID, setDeployID] = useState('')
  const dispatch = useDispatch()
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={1}>MicoDB</Typography.Title>
      </Col>
      <Col span={24}>
        <Typography.Text>
          Cloud-hosted MicoDB service on Google Sheet and Google Script. Deploy,
          operate, and scale a MicoDB in just a few clicks
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card bodyStyle={{ padding: 8 }} bordered={false}>
              <Input
                placeholder="Deploy ID"
                value={deployID}
                size="small"
                bordered={false}
                prefix={
                  <Button
                    type="text"
                    style={{ marginLeft: -7 }}
                    size="small"
                    onClick={deployID ? () => setDeployID('') : undefined}
                    icon={<Icon name={deployID ? 'close-outline' : 'code'} />}
                  />
                }
                suffix={<SenTradeMark style={{ marginRight: -7 }} />}
                onChange={(e) => setDeployID(e.target.value)}
              />
            </Card>
          </Col>
        </Row>
        <Col span={24} style={{ height: 24 }} /> {/* Safe sapce */}
        <Button
          type="primary"
          icon={<Icon name="send" />}
          block
          onClick={() => dispatch(connectDatabase({deployID}))}
        >
          Connect
        </Button>
      </Col>
    </Row>
  )
}

export default Login
