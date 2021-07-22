import { useState } from 'react'
import PropTypes from 'prop-types'
import ssjs from 'senswapjs'

import {
  Row,
  Col,
  Button,
  Card,
  Typography,
  Icon,
  Input,
  Space,
  Tooltip,
} from 'sen-kit'

import util from 'helpers/util'
import { useSenOs } from 'helpers/senos'

const Transfer = ({ accountData, onChange }) => {
  const [srcValue, setSrcValue] = useState('')
  const [dstValue, setDstValue] = useState('')
  const [error, setError] = useState('')

  const { address, amount: maxAmount } = accountData
  const balance = ssjs.undecimalize(maxAmount, 9)
  const {
    senos: { notify },
  } = useSenOs()

  const handleMax = () => setSrcValue(balance)
  const transfer = async () => {
    try {
      const wallet = window.senos.wallet
      const lamports = window.senos.lamports
      const amount = ssjs.decimalize(srcValue, 9)
      if (!amount) return setError('Invalid amount')
      if (amount > maxAmount) return setError('Exceed your available balance')
      if (!ssjs.isAddress(dstValue)) return setError('Invalid receiver address')
      const { txId } = await lamports.transfer(amount, dstValue, wallet)
      await notify({
        type: 'success',
        description: `Transfer ${srcValue} SOL to ${
          dstValue.substring(0, 6) +
          '...' +
          dstValue.substring(dstValue.length - 6, dstValue.length)
        } successfully. Click to view details.`,
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
      return onChange(txId)
    } catch (er) {
      return setError(er.message)
    }
  }
  const icon = () => {
    if (!ssjs.isAddress(dstValue))
      return (
        <Tooltip title="Invalid address">
          <Icon name="warning-outline" style={{ color: '#F2323F' }} />
        </Tooltip>
      )
    return (
      <Tooltip title={`The account is safe to transfer.`}>
        <Icon name="shield-checkmark-outline" style={{ color: '#3DBA4E' }} />
      </Tooltip>
    )
  }

  return (
    <Card bordered={false}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Text>Amount</Typography.Text>
        </Col>
        <Col span={24}>
          <Input
            placeholder={0}
            suffix={
              <Button
                type="text"
                style={{ marginRight: -7 }}
                onClick={handleMax}
              >
                MAX
              </Button>
            }
            value={srcValue}
            onChange={(e) => {
              setError('')
              setSrcValue(e.target.value || '')
            }}
          />
        </Col>
        <Col span={24}>
          <Typography.Text>Receiver Address</Typography.Text>
        </Col>
        <Col span={24}>
          <Input
            placeholder={address.substring(0, 6) + '...'}
            suffix={
              <Button
                type="text"
                shape="circle"
                style={{ marginRight: -7 }}
                icon={icon()}
              />
            }
            value={dstValue}
            onChange={(e) => {
              setError('')
              setDstValue(e.target.value || '')
            }}
          />
        </Col>
        <Col span={24}>
          {error ? (
            <Typography.Text type="danger" style={{ fontSize: 11 }}>
              <Space>
                <Icon name="warning-outline" />
                {error}
              </Space>
            </Typography.Text>
          ) : null}
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
  accountData: {},
  onChange: () => {},
}

Transfer.propTypes = {
  accountData: PropTypes.object,
  onChange: PropTypes.func,
}

export default Transfer
