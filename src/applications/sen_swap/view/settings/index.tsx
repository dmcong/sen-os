import {
  Row,
  Col,
  Button,
  Popover,
  Typography,
  Icon,
  Divider,
} from '@senswap/sen-ui'
import Slippage from './slippage'
import Advanced from './advanced'

import { updateSettings } from '@/sen_swap/controller/settings.controller'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '@/sen_swap/model'

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const settings = useSelector((state: AppState) => state.settings)

  const onSlippage = (slippage: number) => {
    return dispatch(updateSettings({ ...settings, slippage }))
  }
  const onAdvanced = (advanced: boolean) => {
    return dispatch(updateSettings({ ...settings, advanced }))
  }

  return (
    <Popover
      placement="bottomRight"
      overlayInnerStyle={{ width: 300 }}
      content={
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Typography.Title level={5}>Settings</Typography.Title>
          </Col>
          <Col span={24}>
            <Slippage value={settings.slippage} onChange={onSlippage} />
          </Col>
          <Divider style={{ marginTop: 8, marginBottom: 8 }} />
          <Col span={24}>
            <Advanced value={settings.advanced} onChange={onAdvanced} />
          </Col>
        </Row>
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

export default Settings
