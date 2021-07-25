import PropTypes from 'prop-types'

import { Row, Col, Card } from '@senswap/sen-ui'
import Wrap from './wrap'
import Unwrap from './unwrap'

const Wrapper = ({ data, onChange }) => {
  const { state } = data
  return (
    <Card bordered={false}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          {!state ? (
            <Wrap data={data} onChange={onChange} />
          ) : (
            <Unwrap data={data} onChange={onChange} />
          )}
        </Col>
      </Row>
    </Card>
  )
}

Wrapper.defaultProps = {
  data: {},
  onChange: () => {},
}

Wrapper.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
}

export default Wrapper
