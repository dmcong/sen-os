import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { DEFAULT_EMPTY_ADDRESS, DEFAULT_WSOL } from '@senswap/sen-js'

import { Row, Col, Icon, Modal, Tabs } from '@senswap/sen-ui'
import Header from '@/sen_wallet/view/components/header'
import Info from '@/sen_wallet/view/components/info'
import Wrapper from '@/sen_wallet/view/accountActions/wrapper'
import Transfer from './transfer'

import { useSenOs } from 'helpers/senos'

const Actions = ({ visible, onClose }) => {
  const [mintData, setMintData] = useState({})
  const [wsolAccountAddress, setWSOLAccountAddress] = useState('')
  const {
    senos: {
      wallet: { address, lamports },
      tokenProvider,
    },
  } = useSenOs()

  const accountData = useSelector((state) => state.accounts[wsolAccountAddress])
  const solData = {
    mint: DEFAULT_EMPTY_ADDRESS,
    extensions: { coingeckoId: 'solana' },
    name: 'Solana',
    symbol: 'SOL',
    logoURI: mintData.logoURI,
    decimals: 9,
    address,
    amount: lamports,
    state: 1,
  }
  const wsolData = { ...mintData, ...accountData, address: wsolAccountAddress }

  useEffect(() => {
    ;(async () => {
      const mintData = await tokenProvider.findByAddress(DEFAULT_WSOL)
      await setMintData(mintData)
    })()
  }, [tokenProvider])
  useEffect(() => {
    ;(async () => {
      const splt = window.senos.splt
      const wsolAddress = await splt.deriveAssociatedAddress(
        address,
        DEFAULT_WSOL,
      )
      setWSOLAccountAddress(wsolAddress)
    })()
  }, [address])

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      closeIcon={<Icon name="close" />}
      footer={null}
      destroyOnClose={true}
      centered={true}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Header data={solData} />
        </Col>
        <Col span={24} />
        <Col span={24}>
          <Info data={solData} />
        </Col>
        <Col span={24}>
          <Tabs>
            <Tabs.TabPane key="transfer" tab="Transfer">
              <Transfer data={solData} onChange={onClose} />
            </Tabs.TabPane>
            <Tabs.TabPane key="wrapper" tab="Wrapper">
              <Wrapper data={wsolData} onChange={onClose} />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </Modal>
  )
}

Actions.defaultProps = {
  visible: false,
  onClose: () => {},
}

Actions.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
}

export default Actions
