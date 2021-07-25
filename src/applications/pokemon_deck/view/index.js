import { Row, Col } from '@senswap/sen-ui'

import Deck from './deck'

const View = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Deck />
      </Col>
    </Row>
  )
}

export default View
