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

  return (
    <Card bodyStyle={{ padding: 12 }} bordered={false}>
      <Row gutter={[12, 12]} wrap={false} align="middle">
        <Col span={24} flex="auto">
          <Space direction="vertical" size={0}>
            <Space style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
              <PoolAvatar poolAddress={poolAddress} size={24} />
              <Typography.Text>
                <PoolName poolAddress={poolAddress} />
              </Typography.Text>
            </Space>
            <Space>
              <Tooltip title="The Total Value Locked is roughly estimated and perhaps inaccurate because unknown tokens ain't involved in the computation.">
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                  TVL:
                </Typography.Text>
              </Tooltip>
              <Typography.Text>
                <PoolTVL poolAddress={poolAddress} />
              </Typography.Text>
              <Divider type="vertical" style={{ margin: 0 }} />
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                ROI:
              </Typography.Text>
              <Typography.Text>100%</Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Button type="text" onClick={onClick} icon={<Icon name="open" />} />
        </Col>
      </Row>
    </Card>
  )
}

export default PoolCard
