import React, { useState, useEffect } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'

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

export type AskData = {
  amount: string
  mintInfo?: TokenInfo
}

let timeoutId: ReturnType<typeof setTimeout>

const Ask = ({
  value,
  onChange,
}: {
  value: AskData
  onChange: (value: AskData) => void
}) => {
  const [amount, setAmount] = useState('')
  const [mintInfo, setMintInfo] = useState<TokenInfo>({} as TokenInfo)
  const [error, setError] = useState('')

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

  useEffect(() => {
    onChange({ amount, mintInfo })
  }, [amount, mintInfo, onChange])
  useEffect(() => {
    setAmount(value.amount)
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
          <Col>
            <Typography.Text type="secondary">Available:</Typography.Text>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Ask
