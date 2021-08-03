import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Row, Col, Modal, Icon } from '@senswap/sen-ui'
import LazyLoad from 'react-lazyload'
import LPTCard from './lptCard'
import Deposit from '@/sen_lp/view/components/deposit'
import Withdraw from '@/sen_lp/view/components/withdraw'

import { AppState } from '@/sen_lp/model'

const MyPools = () => {
  const [activeLPTAddress, setActiveLPTAddress] = useState('')
  const [activePoolAddress, setActivePoolAddress] = useState('')
  const lpts = useSelector((state: AppState) => state.lpts)

  const onDeposit = (lptAddress: string) => {
    const { pool } = lpts[lptAddress]
    return setActivePoolAddress(pool)
  }
  const onWithdraw = (lptAddress: string) => {
    return setActiveLPTAddress(lptAddress)
  }

  return (
    <Row gutter={[12, 12]}>
      {Object.keys(lpts).map((lptAddress, i) => (
        <Col span={24} key={lptAddress + i}>
          <LazyLoad height={80} overflow>
            <LPTCard
              data={lpts[lptAddress]}
              onDeposit={() => onDeposit(lptAddress)}
              onWithdraw={() => onWithdraw(lptAddress)}
            />
          </LazyLoad>
        </Col>
      ))}
      <Modal
        visible={activePoolAddress}
        onCancel={() => setActivePoolAddress('')}
        closeIcon={<Icon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Deposit
          poolAddress={activePoolAddress}
          onClose={() => setActivePoolAddress('')}
        />
      </Modal>
      <Modal
        visible={activeLPTAddress}
        onCancel={() => setActiveLPTAddress('')}
        closeIcon={<Icon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Withdraw
          lptAddress={activeLPTAddress}
          onClose={() => setActiveLPTAddress('')}
        />
      </Modal>
    </Row>
  )
}

export default MyPools
