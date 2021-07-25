import { useState } from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import { account, utils } from '@senswap/sen-js'

import {
  Row,
  Col,
  Button,
  Input,
  Space,
  Typography,
  Icon,
  Tooltip,
} from '@senswap/sen-ui'

import { useSenOs } from 'helpers/senos'
import util from 'helpers/util'

const Wrap = ({ data, onChange }) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const {
    senos: {
      wallet: { lamports },
    },
  } = useSenOs()
  const { address, symbol } = data
  const sol = utils.undecimalize(lamports, 9)
  const handleMax = () => setValue(sol)

  const {
    senos: {
      wallet: { address: ownerAddress },
      notify,
    },
  } = useSenOs()
  const wrap = async () => {
    try {
      const { splt, wallet } = window.senos
      if (!account.isAddress(ownerAddress))
        return setError('Please connect your wallet')
      let amount = 0n
      try {
        amount = utils.decimalize(value, 9)
      } catch (er) {
        /* Skip errors */
      }
      if (!amount) return setError('Invalid amount')
      const { txId } = await splt.wrap(amount, ownerAddress, wallet)
      await notify({
        type: 'success',
        description: `Wrap ${value} ${symbol} successfully. Click to view details.`,
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
      return onChange(txId)
    } catch (er) {
      return setError(er.message)
    }
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Input
              placeholder={0}
              prefix={
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
              }
              suffix={
                <Button
                  type="text"
                  style={{ marginRight: -7 }}
                  onClick={handleMax}
                >
                  MAX
                </Button>
              }
              value={value}
              onChange={(e) => {
                setError('')
                setValue(e.target.value || '')
              }}
            />
          </Col>
          <Col flex="auto">
            {error ? (
              <Typography.Text type="danger" style={{ fontSize: 11 }}>
                <Space>
                  <Icon name="warning-outline" />
                  {error}
                </Space>
              </Typography.Text>
            ) : null}
          </Col>
          <Col>
            <Space style={{ fontSize: 11 }}>
              <Typography.Text type="secondary">Available:</Typography.Text>
              <Typography.Text>
                {numeral(sol).format('0.[000]')}
              </Typography.Text>
              <Typography.Text type="secondary">SOL</Typography.Text>
            </Space>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Button type="primary" onClick={wrap} block>
          Wrap
        </Button>
      </Col>
    </Row>
  )
}

Wrap.defaultProps = {
  data: {},
  onChange: () => {},
}

Wrap.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
}

export default Wrap
