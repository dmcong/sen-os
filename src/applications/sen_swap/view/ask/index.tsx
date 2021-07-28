import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { TokenInfo } from '@solana/spl-token-registry'
import { account, utils, AccountData, PoolData } from '@senswap/sen-js'
import numeral from 'numeral'

import {
  Row,
  Col,
  Input,
  Typography,
  Card,
  Space,
  Tooltip,
  Icon,
} from '@senswap/sen-ui'
import MintSelection from '@/sen_swap/view/mintSelection'

import { AppState } from '@/sen_swap/model'

export type AskData = {
  amount: string
  accountData?: AccountData
  mintInfo?: TokenInfo
  pools?: PoolData[]
}

let timeoutId: ReturnType<typeof setTimeout>

const Ask = ({
  value,
  onChange,
}: {
  value: AskData
  onChange: (value: AskData) => void
}) => {
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')
  const [mintInfo, setMintInfo] = useState<TokenInfo>({} as TokenInfo)
  const accounts = useSelector((state: AppState) => state.accounts)
  const pools = useSelector((state: AppState) => state.pools)

  // Compute account data
  const accountData = useMemo(() => {
    return Object.keys(accounts)
      .map((key) => accounts[key])
      .find(({ mint: mintAddress }) => mintAddress === mintInfo.address)
  }, [accounts, mintInfo])
  // Compute available pools
  const askPools = useMemo(() => {
    const mintAddress = mintInfo.address
    if (!mintAddress || !account.isAddress(mintAddress)) return []
    return Object.keys(pools)
      .map((poolAddress) => pools[poolAddress])
      .filter(({ mint_s, mint_a, mint_b }) =>
        [mint_s, mint_a, mint_b].includes(mintAddress),
      )
  }, [pools, mintInfo])
  // Compute human-readable balance
  const balance = useMemo(() => {
    const { decimals } = mintInfo
    if (!accountData || !decimals) return 0
    const { amount } = accountData
    return utils.undecimalize(amount, decimals)
  }, [accountData, mintInfo])

  // Handle errors
  const onError = (er: string) => {
    if (timeoutId) clearTimeout(timeoutId)
    setError(er)
    timeoutId = setTimeout(() => setError(''), 500)
  }
  // Handle amount
  const onAmount = (val: string) => {
    const reg = /^-?\d*(\.\d*)?$/
    if (!reg.test(val)) return onError('Invalid character')
    return setAmount(val)
  }

  // Return data to parents
  useEffect(() => {
    onChange({ amount, mintInfo, accountData, pools: askPools })
  }, [amount, mintInfo, accountData, askPools, onChange])
  // Receive data from parents
  useEffect(() => {
    setAmount(value.amount)
    if (value.mintInfo) setMintInfo(value.mintInfo)
  }, [value])

  return (
    <Row gutter={[4, 4]}>
      <Col span={24} style={{ fontSize: 11 }}>
        <Typography.Text type="secondary">To</Typography.Text>
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
          <Typography.Text type="secondary">
            Available: {numeral(balance || 0).format('0,0.[00]')}{' '}
            {mintInfo.symbol}
          </Typography.Text>
        </Row>
      </Col>
    </Row>
  )
}

export default Ask
