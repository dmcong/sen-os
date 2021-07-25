import { useState } from 'react'
import PropTypes from 'prop-types'
import { account } from '@senswap/sen-js'

import { Row, Col, Button, Card } from '@senswap/sen-ui'
import Source from './source'
import Destination from './destination'

import util from 'helpers/util'
import { useSenOs } from 'helpers/senos'

const Transfer = ({ data, onChange }) => {
  const [srcValue, setSrcValue] = useState('')
  const [srcError, setSrcError] = useState('')
  const [srcMeta, setSrcMeta] = useState({})
  const [dstValue, setDstValue] = useState('')
  const [dstError, setDstError] = useState('')
  const [dstMeta, setDstMeta] = useState({})

  const {
    senos: { notify },
  } = useSenOs()

  const { address, mint, symbol, amount: maxAmount } = data
  const transfer = async () => {
    const {
      associatedAddress: dstAddress,
      walletAddress: ownerAddress,
      state,
    } = dstMeta
    const { amount } = srcMeta
    if (!amount) return setSrcError('Invalid amount')
    if (amount > maxAmount) return setSrcError('Exceed your available balance')
    if (!account.isAddress(dstAddress))
      return setDstError('Invalid receiver address')
    if (state === 2) return setDstError('The receiver address has been frozen')
    try {
      const { splt, wallet } = window.senos
      if (!state) await splt.initializeAccount(mint, ownerAddress, wallet)
      const { txId } = await splt.transfer(amount, address, dstAddress, wallet)
      await notify({
        type: 'success',
        description: `Transfer ${srcValue} ${symbol} to ${
          dstValue.substring(0, 6) +
          '...' +
          dstValue.substring(dstValue.length - 6, dstValue.length)
        } successfully. Click to view details.`,
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
      return onChange(txId)
    } catch (er) {
      return setDstError(er.message)
    }
  }

  return (
    <Card bordered={false}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Source
            mintAddress={mint}
            accountAddress={address}
            symbol={symbol}
            maxAmount={maxAmount}
            value={srcValue}
            onChange={(value) => {
              setSrcError('')
              setSrcValue(value)
            }}
            onCallback={setSrcMeta}
            error={srcError}
          />
        </Col>
        <Col span={24}>
          <Destination
            mintAddress={mint}
            value={dstValue}
            onChange={(value) => {
              setDstError('')
              setDstValue(value)
            }}
            onCallback={setDstMeta}
            error={dstError}
          />
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={transfer} block>
            Transfer
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

Transfer.defaultProps = {
  data: {},
  onChange: () => {},
}

Transfer.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
}

export default Transfer
