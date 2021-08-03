import numeral from 'numeral'

import { Row, Col, Card, Typography } from '@senswap/sen-ui'
import MintAvatar from '../mintAvatar'

const Info = ({
  mintAddresses,
  amounts,
}: {
  mintAddresses: string[]
  amounts: string[]
}) => {
  return (
    <Card bordered={false}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Text>You will receive</Typography.Text>
        </Col>
        {mintAddresses.map((mintAddress, i) => (
          <Col span={24} key={mintAddress + i}>
            <Row gutter={[8, 8]} justify="space-between" align="baseline">
              <Col>
                <MintAvatar mintAddress={mintAddress} size={32} />
              </Col>
              <Col>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {numeral(amounts[i] || 0).format('0,0.[0000]')}
                </Typography.Title>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default Info
