import { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { account } from '@senswap/sen-js'

import { Row, Col, Icon, Modal, Typography, Tabs } from '@senswap/sen-ui'
import { parseCID } from './syncLink'
import Backup from './backup'
import Restore from './restore'

import { RootState, RootDispatch } from 'store'
import { openWallet, closeWallet } from 'store/wallet.reducer'
import { toggleSync } from 'store/ui.reducer'

const Sync = () => {
  const [mode, setMode] = useState('backup')
  const dispatch = useDispatch<RootDispatch>()
  const history = useHistory()
  const { address } = useSelector((state: RootState) => state.wallet)
  const { visibleSync } = useSelector((state: RootState) => state.ui)

  const sync = parseCID(window.location.href)
  const onClose = async () => {
    const {
      location: { origin, pathname },
    } = window
    await history.push(origin + pathname)
    await dispatch(toggleSync(false))
  }

  useEffect(() => {
    if (!sync) setMode('backup')
    else if (!account.isAddress(address)) {
      dispatch(openWallet())
    } else {
      dispatch(closeWallet())
      setMode('restore')
      dispatch(toggleSync(true))
    }
  }, [dispatch, sync, address])

  if (!account.isAddress(address)) return <Fragment />
  return (
    <Modal
      visible={visibleSync}
      onCancel={onClose}
      closeIcon={<Icon name="close" />}
      footer={null}
      destroyOnClose={true}
      centered={true}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Backup & Restore
          </Typography.Title>
        </Col>
        <Col span={24} />
        <Col span={24}>
          <Tabs defaultActiveKey={mode}>
            <Tabs.TabPane tab="Backup" key="backup">
              <Backup />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Restore" key="restore">
              <Restore />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </Modal>
  )
}

export default Sync
