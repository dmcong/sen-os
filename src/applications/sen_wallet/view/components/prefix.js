import PropTypes from 'prop-types'
import { account } from '@senswap/sen-js'

import { Button, Icon, Tooltip } from '@senswap/sen-ui'

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
        disabled={!account.isAddress(address)}
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
