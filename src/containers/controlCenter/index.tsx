import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Row,
  Col,
  Icon,
  Switch,
  Space,
  Drawer,
  Typography,
  Divider,
  Card,
  Button,
  Badge,
} from '@senswap/sen-ui'
import Navigation from './navigation'
import Shelf from './shelf'

import './style.less'
import { RootDispatch, RootState } from 'store'
import { toggleSync } from 'store/ui.reducer'

const ControlCenter = () => {
  const [settings, setSettings] = useState(false)
  const dispatch = useDispatch<RootDispatch>()
  const { visibleControlCenter, visibleSync } = useSelector(
    (state: RootState) => state.ui,
  )

  useEffect(() => {
    setSettings(false)
  }, [visibleControlCenter])

  return (
    <Drawer
      placement="bottom"
      className={`controll-center ${visibleControlCenter ? 'open' : 'close'}`}
      height="100%"
      bodyStyle={{ padding: 16 }}
      closable={false}
      mask={false}
      visible
    >
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col span={24}>
          <Navigation />
        </Col>
        <Col span={24} />
        <Col span={24}>
          <Row gutter={[16, 16]} justify="center">
            <Col>
              <Card hoverable>
                <Space>
                  <Badge status="success">
                    <Button
                      type="text"
                      className="contained"
                      icon={<Icon name="cloudy-outline" />}
                      onClick={() => dispatch(toggleSync(!visibleSync))}
                    />
                  </Badge>
                  <Divider type="vertical" />
                  <Typography.Text>
                    Let's customize your workspace!
                  </Typography.Text>
                  <Divider type="vertical" />
                  <Switch
                    size="small"
                    checkedChildren={<Icon name="cog-outline" />}
                    unCheckedChildren={<Icon name="cog-outline" />}
                    checked={settings}
                    onChange={setSettings}
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={24} />
        <Col span={24}>
          <Shelf settings={settings} />
        </Col>
      </Row>
    </Drawer>
  )
}

export default ControlCenter
