import { Fragment, useState } from 'react'

import { Row, Col, Modal, Icon, Button, Typography } from '@senswap/sen-ui'
import { useSenOs } from 'helpers/senos'
import Amount from '../components/amount'
import config from '@/sen_lp/config'

const NewPool = () => {
  const [visible, setVisible] = useState(false)
  const [sen, setSen] = useState<bigint>(BigInt(0))

  const {
    senos: {
      wallet: { address: walletAddress },
    },
  } = useSenOs()
  const {
    sol: { senAddress },
  } = config

  return (
    <Fragment>
      <Button
        type="primary"
        size="small"
        icon={<Icon name="add-outline" />}
        onClick={() => setVisible(!visible)}
      >
        New
      </Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        closeIcon={<Icon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Typography.Title level={5}>New Pool</Typography.Title>
          </Col>
          <Col span={24}>
            <Typography.Paragraph type="secondary">
              <strong style={{ color: 'white' }}>SEN Token is required.</strong>{' '}
              A pool in SenSwap is a trilogy in which SEN plays the role of
              middle man to reduce fee, leverage routing, and realize DAO.
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary">
              <strong style={{ color: 'white' }}>
                Liquidity provider incentive.
              </strong>{' '}
              Liquidity providers earn a 0.25% fee on all trades proportional to
              their share of the pool. Fees are accrued into the pool and can be
              claimed by withdrawing your liquidity.
            </Typography.Paragraph>
          </Col>
          <Col span={24}>
            <Amount mintAddress={senAddress} onChange={setSen} />
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default NewPool
