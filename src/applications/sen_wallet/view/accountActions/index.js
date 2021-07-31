import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { DEFAULT_WSOL } from '@senswap/sen-js'

import { Row, Col, Modal, Icon, Tabs } from '@senswap/sen-ui'
import Header from '@/sen_wallet/view/components/header'
import Info from '@/sen_wallet/view/components/info'
import Transfer from './transfer'
import Wrapper from './wrapper'
import Close from './close'

import { useSenOs } from 'helpers/senos'

const AccountActions = ({ visible, onClose, accountData }) => {
  const [mintData, setMintData] = useState({})
  const {
    senos: { tokenProvider },
  } = useSenOs()

  const { mint } = accountData
  useEffect(() => {
    ;(async () => {
      const mintData = (await tokenProvider.findByAddress(mint)) || {}
      await setMintData(mintData)
    })()
  }, [mint, tokenProvider])

  const data = { ...mintData, ...accountData }
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
          <Header data={data} />
        </Col>
        <Col span={24} />
        <Col span={24}>
          <Info data={data} />
        </Col>
        <Col span={24}>
          <Tabs>
            <Tabs.TabPane key="transfer" tab="Transfer">
              <Transfer data={data} onChange={onClose} />
            </Tabs.TabPane>
            <Tabs.TabPane
              key="wrapper"
              tab="Wrapper"
              disabled={mint !== DEFAULT_WSOL}
            >
              <Wrapper data={data} onChange={onClose} />
            </Tabs.TabPane>
            <Tabs.TabPane key="close" tab="Close">
              <Close data={data} onChange={onClose} />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </Modal>
  )
}

AccountActions.defaultProps = {
  accountData: {},
  visible: false,
  onClose: () => {},
}

AccountActions.propTypes = {
  accountData: PropTypes.object,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
}

export default AccountActions
