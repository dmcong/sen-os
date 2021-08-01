import { Space, Avatar, Icon } from '@senswap/sen-ui'
import LOGO from 'static/images/sen.svg'

export const SenTradeMark = () => {
  return (
    <Space size={2} style={{ marginLeft: -4 }}>
      <Avatar src={LOGO} size={20} style={{ backgroundColor: 'transparent' }}>
        <Icon name="flower-outline" />
      </Avatar>
      <div style={{ color: '#ffffff73', whiteSpace: 'nowrap', fontSize: 7 }}>
        Powered by Sen
      </div>
    </Space>
  )
}
