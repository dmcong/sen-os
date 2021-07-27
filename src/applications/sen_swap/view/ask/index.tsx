import React, { useState } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'

import { Row, Col, Input, Typography, Card, Space } from '@senswap/sen-ui'
import MintSelection from '@/sen_swap/view/mintSelection'
import Limit from './limit'

const Ask = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  const [mint, setMint] = useState<TokenInfo>({} as TokenInfo)
  const [limit, setLimit] = useState('0')

  return (
    <Row gutter={[4, 4]}>
      <Col span={24} style={{ fontSize: 11 }}>
        <Typography.Text type="secondary">To</Typography.Text>
      </Col>
      <Col span={24}>
        <Card bordered={false} bodyStyle={{ padding: 4 }}>
          <Input
            placeholder="0"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.value || '')
            }
            prefix={<MintSelection value={mint} onChange={setMint} />}
            suffix={<Limit value={limit} onChange={setLimit} />}
            bordered={false}
          />
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
