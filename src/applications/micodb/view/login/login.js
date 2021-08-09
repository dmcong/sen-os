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
import { useSenOs } from 'helpers/senos'

const Login = () => {
  const [deployID, setDeployID] = useState(
    'AKfycbzj3BGSt7tkKpC36tl8yn2QfJiYHdAR1CDl2EW9cqkLpiyKzOBYd0FCAiv7jpgOM94G',
  )
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const {
    senos: { notify },
  } = useSenOs()

  async function handleConnect() {
    setIsLoading(true)
    const response = await dispatch(connectDatabase({ deployID }))
    if (!response.payload)
      notify({ type: 'error', description: 'Invalid Deploy ID' })
    setIsLoading(false)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24} style={{ marginTop: 16 }}>
        <Typography.Title level={1}>MicoDB</Typography.Title>
      </Col>
      <Col span={24}>
        <Typography.Text>
          Cloud-hosted MicoDB service on Google Sheet and Google Script. Deploy,
          operate, and scale a MicoDB in just a few clicks.
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
                disabled={isLoading}
              />
            </Card>
          </Col>
        </Row>
        <Col span={24} style={{ height: 24 }} /> {/* Safe sapce */}
        <Button
          type="primary"
          icon={<Icon name="send" />}
          block
          onClick={() => handleConnect()}
          loading={isLoading}
          disabled={!deployID}
        >
          {isLoading ? 'Connecting' : 'Connect'}
        </Button>
      </Col>
    </Row>
  )
}

export default Login
