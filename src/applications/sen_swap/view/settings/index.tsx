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

export type SettingsInfo = {
  slippage: number
  advanced: boolean
}

const Settings = ({
  value,
  onChange,
}: {
  value: SettingsInfo
  onChange: (value: SettingsInfo) => void
}) => {
  const onSlippage = (slippage: number) => {
    return onChange({ ...value, slippage })
  }
  const onAdvanced = (advanced: boolean) => {
    return onChange({ ...value, advanced })
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
            <Slippage value={value.slippage} onChange={onSlippage} />
          </Col>
          <Divider style={{ marginTop: 8, marginBottom: 8 }} />
          <Col span={24}>
            <Advanced value={value.advanced} onChange={onAdvanced} />
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
