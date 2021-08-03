import { Row, Col, Typography, Tabs } from '@senswap/sen-ui'
import FullSide from './fullSide'
import SingleSide from './singleSide'

const Deposit = ({
  poolAddress,
  onClose = () => {},
}: {
  poolAddress: string
  onClose?: () => void
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Deposit Liquidity</Typography.Title>
      </Col>
      <Col span={24}>
        <Typography.Paragraph type="secondary">
          <strong style={{ color: 'white' }}>
            Liquidity provider incentive.
          </strong>{' '}
          Liquidity providers earn a 0.25% fee on all trades proportional to
          their share of the pool. Fees are accrued into the pool and can be
          claimed by withdrawing your liquidity.
        </Typography.Paragraph>
        <Typography.Paragraph type="secondary">
          <strong style={{ color: 'white' }}>
            Simulated Single Expossure.
          </strong>{' '}
          Instead of depositing proportionally the amount of three tokens, SSE
          allows you to deposit even one token type. The pool will automatically
          re-balance itself.
        </Typography.Paragraph>
      </Col>
      <Col span={24}>
        <Tabs>
          <Tabs.TabPane key="single-side" tab="Single Side">
            <SingleSide poolAddress={poolAddress} onClose={onClose} />
          </Tabs.TabPane>
          <Tabs.TabPane key="full-side" tab="Full Side">
            <FullSide poolAddress={poolAddress} onClose={onClose} />
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </Row>
  )
}

export default Deposit
