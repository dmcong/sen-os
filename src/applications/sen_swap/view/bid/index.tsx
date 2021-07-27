import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { TokenInfo } from '@solana/spl-token-registry'
import { utils, AccountData } from '@senswap/sen-js'
import numeral from 'numeral'

import {
  Row,
  Col,
  Input,
  Typography,
  Button,
  Card,
  Tooltip,
  Space,
  Icon,
} from '@senswap/sen-ui'
import MintSelection from '@/sen_swap/view/mintSelection'

import { AppState } from '@/sen_swap/model'

export type BidData = {
  amount: string
  accountData?: AccountData
  mintInfo?: TokenInfo
}

let timeoutId: ReturnType<typeof setTimeout>

const Bid = ({
  value,
  onChange,
}: {
  value: BidData
  onChange: (value: BidData) => void
}) => {
  const [amount, setAmount] = useState('')
  const [mintInfo, setMintInfo] = useState<TokenInfo>({} as TokenInfo)
  const accounts = useSelector((state: AppState) => state.accounts)
  const [error, setError] = useState('')

  const accountData = useMemo(() => {
    if (value.accountData) return value.accountData
    return Object.keys(accounts)
      .map((key) => accounts[key])
      .find(({ mint: mintAddress }) => mintAddress === mintInfo.address)
  }, [accounts, mintInfo, value.accountData])
  const balance = useMemo(() => {
    const { decimals } = mintInfo
    if (!accountData || !decimals) return 0
    const { amount } = accountData
    return utils.undecimalize(amount, decimals)
  }, [accountData, mintInfo])

  const onError = (er: string) => {
    if (timeoutId) clearTimeout(timeoutId)
    setError(er)
    timeoutId = setTimeout(() => setError(''), 500)
  }
  const onAmount = (val: string) => {
    const reg = /^-?\d*(\.\d*)?$/
    if (!reg.test(val)) return onError('Invalid character')
    return setAmount(val)
  }
  const onMax = () => onAmount(balance.toString())

  useEffect(() => {
    onChange({ amount, accountData, mintInfo })
  }, [amount, mintInfo, accountData, onChange])
  useEffect(() => {
    setAmount(value.amount)
    if (value.mintInfo) setMintInfo(value.mintInfo)
  }, [value])

  return (
    <Row gutter={[4, 4]}>
      <Col span={24} style={{ fontSize: 11 }}>
        <Typography.Text type="secondary">From</Typography.Text>
      </Col>
      <Col span={24}>
        <Card bordered={false} bodyStyle={{ padding: 4 }}>
          <Tooltip
            title={
              <Space>
                <Icon name="warning" />
                {error}
              </Space>
            }
            visible={error}
          >
            <Input
              placeholder="0"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onAmount(e.target.value || '')
              }
              prefix={<MintSelection value={mintInfo} onChange={setMintInfo} />}
              suffix={
                <Button
                  type="text"
                  size="small"
                  style={{ fontSize: 11, marginRight: -7 }}
                  onClick={onMax}
                >
                  MAX
                </Button>
              }
              bordered={false}
            />
          </Tooltip>
        </Card>
      </Col>
      <Col span={24}>
        <Row gutter={[4, 4]} wrap={false} style={{ fontSize: 11 }}>
          <Col flex="auto">
            <Typography.Text type="secondary">Price:</Typography.Text>
          </Col>
          <Col>
            <Typography.Text type="secondary">
              Available: {numeral(balance || 0).format('0,0.[00]')}{' '}
              {mintInfo.symbol}
            </Typography.Text>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Bid
