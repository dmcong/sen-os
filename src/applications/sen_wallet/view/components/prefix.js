import PropTypes from 'prop-types'
import ssjs from 'senswapjs'

import { Button, Icon, Tooltip } from 'sen-kit'

import util from 'helpers/util'

const Prefix = ({ address, symbol }) => {
  return (
    <Tooltip title={`The ${symbol} associated account: ${address}`}>
      <Button
        type="link"
        style={{ marginLeft: -7, color: 'inherit' }}
        icon={<Icon name="wallet-outline" />}
        href={util.explorer(address)}
        target="_blank"
        rel="noopener noreferrer"
        disabled={!ssjs.isAddress(address)}
      >
        {symbol}
      </Button>
    </Tooltip>
  )
}

Prefix.defaultProps = {
  address: '',
  symbol: 'TOKEN',
}

Prefix.propTypes = {
  address: PropTypes.string,
  symbol: PropTypes.string,
}

export default Prefix
