import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { account } from '@senswap/sen-js'

import {
  Row,
  Col,
  Input,
  Typography,
  Button,
  Tooltip,
  Icon,
  Space,
} from '@senswap/sen-ui'

const DEFAULT_META = { walletAddress: '', associatedAddress: '', state: 0 }
const inferAccounts = async (addr, mintAddress) => {
  const { splt } = window.senos
  let meta = { ...DEFAULT_META }
  // Validate inputed addresses
  if (!account.isAddress(addr) || !account.isAddress(mintAddress)) return meta
  // Classify inputed address
  try {
    if (account.isAssociatedAddress(addr)) meta.associatedAddress = addr
    else {
      meta.walletAddress = addr
      meta.associatedAddress = await splt.deriveAssociatedAddress(
        addr,
        mintAddress,
      )
    }
  } catch (er) {
    return meta
  }
  // Get the status of the associated address
  try {
    const data = await splt.getAccountData(meta.associatedAddress)
    meta.walletAddress = data.owner
    meta.state = data.state
  } catch (er) {
    return meta
  }
  // Return
  return meta
}

const Destination = ({ mintAddress, value, onChange, onCallback, error }) => {
  const [meta, setMeta] = useState({ ...DEFAULT_META })

  useEffect(() => {
    ;(async () => {
      const data = await inferAccounts(value, mintAddress)
      await setMeta(data)
    })()
  }, [value, mintAddress])
  useEffect(() => onCallback({ ...meta }), [meta, onCallback])

  const icon = () => {
    if (!account.isAddress(meta.associatedAddress))
      return (
        <Tooltip title="Invalid address">
          <Icon name="warning-outline" style={{ color: '#F2323F' }} />
        </Tooltip>
      )
    if (meta.state === 0)
      return (
        <Tooltip title="The receiver account is not created. You may pay little fee to create one for them.">
          <Icon name="help-circle-outline" style={{ color: '#FCB017' }} />
        </Tooltip>
      )
    if (meta.state === 2)
      return (
        <Tooltip title="The receiver account is frozen. You cannot send assets to a frozen account.">
          <Icon name="help-circle-outline" style={{ color: '#FCB017' }} />
        </Tooltip>
      )
    return (
      <Tooltip
        title={`The account is safe to transfer. The receiver associated address is ${meta.associatedAddress}.`}
      >
        <Icon name="shield-checkmark-outline" style={{ color: '#3DBA4E' }} />
      </Tooltip>
    )
  }

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text>Receiver Address</Typography.Text>
      </Col>
      <Col span={24}>
        <Input
          placeholder={mintAddress.substring(0, 6) + '...'}
          suffix={
            <Button
              type="text"
              shape="circle"
              style={{ marginRight: -7 }}
              icon={icon()}
            />
          }
          value={value}
          onChange={(e) => onChange(e.target.value || '')}
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
    </Row>
  )
}

Destination.defaultProps = {
  mintAddress: '',
  value: '',
  onChange: () => {},
  onCallback: () => {},
  error: '',
}

Destination.propTypes = {
  mintAddress: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onCallback: PropTypes.func,
  error: PropTypes.string,
}

export default Destination
