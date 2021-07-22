import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Icon, Modal, Typography, Tabs } from 'sen-kit'
import { parseCID } from './syncLink'
import Backup from './backup'
import Restore from './restore'

import { RootState, RootDispatch } from 'store'
import { toggleSync } from 'store/ui.reducer'

const Sync = () => {
  const [mode, setMode] = useState('backup')
  const dispatch = useDispatch<RootDispatch>()
  const { visibleSync } = useSelector((state: RootState) => state.ui)

  const sync = parseCID(window.location.href)

  useEffect(() => {
    if (!sync) setMode('backup')
    else {
      setMode('restore')
      dispatch(toggleSync(true))
    }
  }, [dispatch, sync])

  console.log(mode)
  return (
    <Modal
      visible={visibleSync}
      onCancel={() => dispatch(toggleSync(false))}
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
