import { Row, Col, Spin, Widget } from 'sen-kit'

/**
 * Lazy Loading
 */
const AppLoading = () => {
  return (
    <Widget type="glass">
      <Row
        gutter={[8, 8]}
        style={{ height: '100%' }}
        align="middle"
        justify="center"
      >
        <Col>
          <Spin size="large" />
        </Col>
      </Row>
    </Widget>
  )
}

export default AppLoading
