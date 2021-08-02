import { PoolData } from '@senswap/sen-js'

import {
  Row,
  Col,
  Card,
  Space,
  Typography,
  Divider,
  Icon,
  Tooltip,
  Button,
} from '@senswap/sen-ui'
import PoolAvatar from '../components/poolAvatar'
import PoolName from '../components/poolName'
import PoolTVL from '../components/poolTVL'

const PoolCard = ({
  data,
  onClick,
}: {
  data: PoolData & { address: string }
  onClick: () => void
}) => {
  const { address: poolAddress } = data
  console.log(poolAddress)

  return (
    <Card bodyStyle={{ padding: 12 }} bordered={false}>
      <Row gutter={[12, 0]}>
        <Col span={24}>
          <Row gutter={[16, 16]} wrap={false} align="middle">
            <Col flex="auto">
              <PoolAvatar poolAddress={poolAddress} size={24} />
            </Col>
            <Col>
              <Button type="primary" onClick={onClick} size="small">
                Deposit
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Space style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
            <Typography.Text>
              <PoolName poolAddress={poolAddress} />
            </Typography.Text>
            <Divider type="vertical" style={{ margin: 0 }} />
            <Tooltip title="The Total Value Locked is roughly estimated and perhaps inaccurate because unknown tokens ain't involved in the computation.">
              <Space size={4}>
                <Typography.Text type="secondary">
                  <Icon name="information-circle-outline" />
                </Typography.Text>
                <Typography.Text type="secondary">TVL:</Typography.Text>
              </Space>
            </Tooltip>
            <Typography.Text>
              <PoolTVL poolAddress={poolAddress} />
            </Typography.Text>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default PoolCard
