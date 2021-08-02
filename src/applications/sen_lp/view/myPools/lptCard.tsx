import { utils } from '@senswap/sen-js'
import numeral from 'numeral'

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

import { LPTData } from '../../controller/lpts.controller'
import PoolTVL from '../components/poolTVL'

const LPTCard = ({ data, onClick }: { data: LPTData; onClick: () => void }) => {
  const { pool: poolAddress, amount } = data
  const lp = utils.undecimalize(amount, 9)

  return (
    <Card bodyStyle={{ padding: `16px 12px` }} bordered={false}>
      <Row gutter={[12, 16]} align="middle" wrap={false}>
        <Col flex="auto">
          <Space direction="vertical" size={0}>
            <Space style={{ whiteSpace: 'nowrap' }}>
              <PoolAvatar poolAddress={poolAddress} size={24} />
              <Space>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                  Your LP:
                </Typography.Text>
                <Typography.Text>
                  {numeral(lp).format('0,0.[00]')}
                </Typography.Text>
              </Space>
            </Space>
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
          </Space>
        </Col>
        <Col>
          <Button type="text" onClick={onClick} icon={<Icon name="open" />} />
        </Col>
      </Row>
    </Card>
  )
}

export default LPTCard
