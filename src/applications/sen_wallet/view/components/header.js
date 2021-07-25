import PropTypes from 'prop-types'

import { Row, Col, Icon, Avatar, Typography } from '@senswap/sen-ui'

const Header = ({ data }) => {
  const { logoURI, name, symbol, mint } = data

  return (
    <Row gutter={[16, 16]} align="middle" wrap={false}>
      <Col>
        <Avatar src={logoURI} size={40}>
          <Icon name="diamond-outline" />
        </Avatar>
      </Col>
      <Col>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {name || mint.substring(0, 6)}
        </Typography.Title>
        <Typography.Text type="secondary" style={{ margin: 0 }}>
          {symbol}
        </Typography.Text>
      </Col>
    </Row>
  )
}

Header.defaultProps = {
  data: {},
}

Header.propTypes = {
  data: PropTypes.object,
}

export default Header
