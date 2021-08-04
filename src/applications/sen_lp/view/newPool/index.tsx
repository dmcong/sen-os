import { Fragment, useState } from 'react'

import { Row, Col, Modal, Icon, Button, Typography } from '@senswap/sen-ui'
import { useSenOs } from 'helpers/senos'
import Amount from '../components/amount'
import config from '@/sen_lp/config'
import AmountSelect from '../components/amountSelect'
import { account } from '@senswap/sen-js'
import util from 'helpers/util'

const NewPool = () => {
  const [visible, setVisible] = useState(false)
  const [sen, setSen] = useState(BigInt(0))
  const [reserveA, setReserveA] = useState(BigInt(0))
  const [mintAddressA, setMintAddressA] = useState('')
  const [reserveB, setReserveB] = useState(BigInt(0))
  const [mintAddressB, setMintAddressB] = useState('')

  const {
    senos: {
      accounts,
      wallet: { address: walletAddress },
      notify,
    },
  } = useSenOs()
  const {
    sol: { senAddress },
  } = config

  const mintAddressesForA = Object.keys(accounts).map(
    (accountAddress) => accounts[accountAddress]?.mint,
  )

  const mintAddressesForB = Object.keys(accounts).map(
    (accountAddress) => accounts[accountAddress]?.mint,
  )

  const isValid =
    sen &&
    reserveA &&
    reserveB &&
    account.isAddress(mintAddressA) &&
    account.isAddress(mintAddressB)

  const onSelectForA = ({
    amount,
    mintAddress,
  }: {
    amount: bigint
    mintAddress: string
  }) => {
    setReserveA(amount)
    setMintAddressA(mintAddress)
  }

  const onSelectForB = ({
    amount,
    mintAddress,
  }: {
    amount: bigint
    mintAddress: string
  }) => {
    setReserveB(amount)
    setMintAddressB(mintAddress)
  }

  const onNewPool = async () => {
    const { swap, splt, wallet } = window.senos
    const mintAddresses = [senAddress, mintAddressA, mintAddressB]
    const srcAddresses = await Promise.all(
      mintAddresses.map((mintAddress) =>
        splt.deriveAssociatedAddress(walletAddress, mintAddress),
      ),
    )
    try {
      const { txId } = await swap.initializePool(
        sen,
        reserveA,
        reserveB,
        walletAddress,
        srcAddresses[0],
        srcAddresses[1],
        srcAddresses[2],
        wallet,
      )
      setVisible(false)
      return notify({
        type: 'success',
        description: 'Create a new pool successfully. Click to view details.',
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
    } catch (er) {
      return notify({ type: 'error', description: er.message })
    }
  }

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
          <Col span={24}>
            <AmountSelect
              mintAddresses={mintAddressesForA}
              onChange={onSelectForA}
            />
          </Col>
          <Col span={24}>
            <AmountSelect
              mintAddresses={mintAddressesForB}
              onChange={onSelectForB}
            />
          </Col>
          <Col span={24}>
            <Row gutter={[4, 4]} justify="end">
              <Col span={24}>
                <Button
                  type="primary"
                  onClick={onNewPool}
                  disabled={!isValid}
                  block
                >
                  New Pool
                </Button>
              </Col>
              <Col>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                  * You may sign more than 4 times to create a new pool.
                </Typography.Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default NewPool
