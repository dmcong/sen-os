import { Row, Col, Avatar, Icon } from '@senswap/sen-ui'
import LOGO from 'static/images/sen.svg'

export const SenTradeMark = ({ style }: { style?: object }) => {
  return (
    <Row gutter={[2, 0]} style={style} align="middle" wrap={false}>
      <Col>
        <div
          style={{
            color: '#ffffff73',
            whiteSpace: 'nowrap',
            fontSize: 7,
          }}
        >
          Powered by
        </div>
      </Col>
      <Col style={{ lineHeight: 1 }}>
        <Avatar src={LOGO} size={20} style={{ backgroundColor: 'transparent' }}>
          <Icon name="flower-outline" />
        </Avatar>
      </Col>
    </Row>
  )
}
