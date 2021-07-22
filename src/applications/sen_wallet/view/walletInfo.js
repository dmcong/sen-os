import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ssjs from 'senswapjs'
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
} from 'sen-kit'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from 'qrcode.react'

import { useSenOs } from 'helpers/senos'
import util from 'helpers/util'
import mintConfig from '@/sen_wallet/config/mint.config'
import { getCGK } from '@/sen_wallet/controller/cgk.controller'

const Copy = ({ address }) => {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    await setCopied(true)
    await util.asyncWait(1500)
    await setCopied(false)
  }
  if (!ssjs.isAddress(address)) return null
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

const getTotalBalance = async (lamports, accounts, getPrice) => {
  let usd = 0
  // Calculate SOL
  const {
    payload: {
      solana: { price: solPrice },
    },
  } = await getPrice('solana')
  usd = usd + ssjs.undecimalize(lamports, 9) * solPrice
  // Calculate mints
  const mintAddresses = mintConfig.map(({ address }) => address)
  const accountAddresses = Object.keys(accounts)
  for (const accountAddress of accountAddresses) {
    const { mint: mintAddress, amount } = accounts[accountAddress] || {}
    const index = mintAddresses.indexOf(mintAddress)
    if (index < 0) continue
    const { ticket, decimals } = mintConfig[index]
    const {
      payload: {
        [ticket]: { price },
      },
    } = await getPrice(ticket)
    usd = usd + ssjs.undecimalize(amount, decimals) * price
  }
  return usd
}

const WalletInfo = () => {
  const [value, setValue] = useState(0)
  const accounts = useSelector((state) => state.accounts)
  const dispatch = useDispatch()
  const {
    senos: {
      wallet: { address, lamports },
    },
  } = useSenOs()

  useEffect(() => {
    ;(async () => {
      const getPrice = (ticket) => dispatch(getCGK(ticket))
      const usd = await getTotalBalance(lamports, accounts, getPrice)
      setValue(usd)
    })()
  }, [lamports, accounts, dispatch])

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
          <Avatar size={48}>{ssjs.randEmoji(address)}</Avatar>
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
