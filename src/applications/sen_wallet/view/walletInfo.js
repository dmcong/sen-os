import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { account, utils } from '@senswap/sen-js'
import numeral from 'numeral'

import {
  Row,
  Col,
  Avatar,
  Typography,
  Tooltip,
  Space,
  Icon,
  Button,
  Popover,
  Card,
} from '@senswap/sen-ui'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from 'qrcode.react'

import { useSenOs } from 'helpers/senos'
import util from 'helpers/util'
import { getCGK } from '@/sen_wallet/controller/cgk.controller'

const Copy = ({ address }) => {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    await setCopied(true)
    await util.asyncWait(1500)
    await setCopied(false)
  }
  if (!account.isAddress(address)) return null
  return (
    <Tooltip title="Copied" visible={copied}>
      <CopyToClipboard text={address} onCopy={onCopy}>
        <Button type="text" size="small" icon={<Icon name="copy-outline" />} />
      </CopyToClipboard>
    </Tooltip>
  )
}

const QR = ({ address }) => {
  return (
    <Popover
      overlayInnerStyle={{ paddingTop: 6 }}
      content={
        <QRCode
          value={address}
          size={140}
          bgColor="#1f1f1f"
          fgColor="#ffffff"
        />
      }
      trigger="click"
    >
      <Button type="text" size="small" icon={<Icon name="qr-code-outline" />} />
    </Popover>
  )
}

const Balance = ({ value }) => {
  const [hidden, setHidden] = useState(true)
  const toggle = () => setHidden(!hidden)
  const balance = numeral(value).format('0,0.[00]')
  return (
    <Space>
      <Typography.Text style={{ margin: 0 }}>
        {hidden ? 'ಠ_ಠ' : `$${balance}`}
      </Typography.Text>
      <Button
        type="text"
        shape="circle"
        size="small"
        icon={<Icon name={hidden ? 'eye-off-outline' : 'eye-outline'} />}
        onClick={toggle}
      />
    </Space>
  )
}

const WalletInfo = () => {
  const [value, setValue] = useState(0)
  const accounts = useSelector((state) => state.accounts)
  const dispatch = useDispatch()
  const {
    senos: {
      tokenProvider,
      wallet: { address, lamports },
    },
  } = useSenOs()

  const getTotalBalance = useCallback(async () => {
    let usd = 0
    // Calculate SOL
    const {
      payload: {
        solana: { price: solPrice },
      },
    } = await dispatch(getCGK('solana'))
    usd = usd + utils.undecimalize(lamports, 9) * solPrice
    // Calculate mints
    for (const accountAddress of Object.keys(accounts)) {
      const { mint: mintAddress, amount } = accounts[accountAddress] || {}
      const mintData = await tokenProvider.findByAddress(mintAddress)
      if (!mintData) continue
      const { extensions, decimals } = mintData
      const ticket = extensions?.coingeckoId
      if (!ticket) continue
      const {
        payload: {
          [ticket]: { price },
        },
      } = await dispatch(getCGK(ticket))
      usd = usd + utils.undecimalize(amount, decimals) * price
    }
    return setValue(usd)
  }, [tokenProvider, lamports, accounts, dispatch])

  useEffect(() => {
    getTotalBalance()
  }, [getTotalBalance])

  const shortenAddress = () => {
    const size = 4
    const prefix = address.substring(0, size)
    const suffix = address.substring(address.length - size, address.length)
    return prefix + ' ... ' + suffix
  }

  return (
    <Card bodyStyle={{ padding: 16 }} bordered={false}>
      <Row gutter={[16, 16]} wrap={false} align="middle">
        <Col>
          <Avatar size={48}>
            <span style={{ fontSize: 24 }}>{utils.randEmoji(address)}</span>
          </Avatar>
        </Col>
        <Col flex="auto">
          <Row>
            <Col span={24}>
              <Row wrap={false}>
                <Col flex="auto">
                  <Tooltip title={address}>
                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                      {shortenAddress()}
                    </Typography.Text>
                  </Tooltip>
                </Col>
                <Col>
                  <Space>
                    <Copy address={address} />
                    <QR address={address} />
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Balance value={value} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default WalletInfo
