import PropTypes from 'prop-types'

import { Row, Col, Avatar } from '@senswap/sen-ui'

const Pokemon = ({ name, onClick, ...rest }) => {
  let code = name
    .replace("'", '')
    .replace('`', '')
    .replace('.', '')
    .replace(' ', '-')
    .replace('♂', '-m')
    .replace('♀', '-f')
    .toLowerCase()
  const src = `https://raw.githubusercontent.com/itsjavi/pokemon-assets/master/assets/img/pokemon/${code}.png`
  return (
    <Row justify="center">
      <Col>
        <Avatar src={src} size={72} onClick={onClick} {...rest} />
      </Col>
      <Col span={24} />
      <Col>
        <p>{name}</p>
      </Col>
    </Row>
  )
}

Pokemon.defaultProps = {
  onClick: () => {},
}

Pokemon.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

export default Pokemon
